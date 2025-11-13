import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

export async function GET(request: NextRequest) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const locale = request.nextUrl.searchParams.get("locale") || "pt-BR";

    // Buscar mentores do Strapi
    const mentorsResponse = await fetch(
      `${STRAPI_API_URL}/api/mentores?populate=*&locale=${locale}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!mentorsResponse.ok) {
      console.error(
        "Strapi response error in mentors:",
        mentorsResponse.status,
        mentorsResponse.statusText
      );
      return NextResponse.json(
        { error: "Failed to fetch mentors from Strapi" },
        { status: mentorsResponse.status }
      );
    }

    const mentorsData = await mentorsResponse.json();
    const mentors = mentorsData.data || mentorsData;

    if (!Array.isArray(mentors) || mentors.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Para cada mentor, buscar seus cursos para calcular alunos
    const processedMentors = await Promise.all(
      mentors.map(async (mentor: any) => {
        const mentorData = mentor.attributes || mentor;

        // Buscar cursos deste mentor
        const coursesResponse = await fetch(
          `${STRAPI_API_URL}/api/cursos?filters[mentor][id][$eq]=${mentor.id}&populate[alunos][fields][0]=id&populate[alunos][fields][1]=nome&locale=${locale}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${ADMIN_TOKEN}`,
            },
            next: { revalidate: 60 },
          }
        );

        let totalCursos = 0;
        let totalAlunos = 0;
        const cursosRelacionados: Array<{
          id: number;
          titulo: string;
          alunos?: Array<{ id: number; nome: string }>;
        }> = [];

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const courses = coursesData.data || coursesData;

          if (Array.isArray(courses)) {
            totalCursos = courses.length;
            const alunosUnicos = new Set<number>();

            courses.forEach((course: any) => {
              const courseData = course.attributes || course;
              cursosRelacionados.push({
                id: courseData.id || course.id,
                titulo: courseData.titulo || "",
                alunos: courseData.alunos || [],
              });

              if (courseData.alunos && Array.isArray(courseData.alunos)) {
                courseData.alunos.forEach((aluno: { id: number; nome: string }) => {
                  alunosUnicos.add(aluno.id);
                });
              }
            });

            totalAlunos = alunosUnicos.size;
          }
        }

        // Usar valores dos campos estáticos como fallback se não conseguir calcular
        if (totalCursos === 0) {
          totalCursos = mentorData.cursos || 0;
        }
        if (totalAlunos === 0) {
          totalAlunos = mentorData.alunos || 0;
        }

        return {
          ...mentor,
          attributes: {
            ...mentorData,
            cursos: totalCursos,
            alunos: totalAlunos,
            cursosRelacionados,
          },
        };
      })
    );

    return NextResponse.json(
      { data: processedMentors },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mentores", data: [] },
      { status: 500 }
    );
  }
}

