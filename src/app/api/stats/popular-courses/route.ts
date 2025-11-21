import { NextResponse } from "next/server";

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

export async function GET() {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Buscar todos os cursos habilitados
    const coursesUrl = `${STRAPI_API_URL}/api/cursos?filters[habilitado][$eq]=true&fields[0]=id&fields[1]=titulo&locale=pt-BR&pagination[pageSize]=1000`;
    const coursesResponse = await fetch(coursesUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      next: { revalidate: 60 },
    });

    if (!coursesResponse.ok) {
      console.error(
        `Failed to fetch courses: ${coursesResponse.status} ${coursesResponse.statusText}`
      );
      return NextResponse.json(
        { error: "Erro ao buscar cursos" },
        { status: coursesResponse.status }
      );
    }

    const coursesData = await coursesResponse.json();
    const coursesRaw = coursesData.data || [];

    // Buscar todos os alunos habilitados com seus cursos
    const studentsUrl = `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=titulo&publicationState=preview&pagination[pageSize]=1000`;
    const studentsResponse = await fetch(studentsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      next: { revalidate: 60 },
    });

    if (!studentsResponse.ok) {
      console.error(
        `Failed to fetch students: ${studentsResponse.status} ${studentsResponse.statusText}`
      );
      return NextResponse.json(
        { error: "Erro ao buscar alunos" },
        { status: studentsResponse.status }
      );
    }

    const studentsData = await studentsResponse.json();
    const students = studentsData.data || [];

    // Criar um mapa para armazenar contagens de alunos por curso
    const courseStudentCounts = new Map<
      number,
      { courseId: number; courseTitle: string; studentCount: number }
    >();

    // Inicializar contagens para cada curso
    coursesRaw.forEach((course: { attributes?: { id?: number; titulo?: string }; id?: number }) => {
      const courseData = course.attributes || course;
      const courseId = courseData.id || course.id;
      const courseTitle = (courseData as { titulo?: string }).titulo || "";

      if (courseId) {
        const normalizedId =
          typeof courseId === "number"
            ? courseId
            : parseInt(String(courseId), 10);
        if (!isNaN(normalizedId)) {
          courseStudentCounts.set(normalizedId, {
            courseId: normalizedId,
            courseTitle,
            studentCount: 0,
          });
        }
      }
    });

    // Contar alunos em cada curso
    students.forEach((student: { attributes?: { cursos?: unknown[] | { data?: unknown[] } }; cursos?: unknown[] | { data?: unknown[] } }) => {
      const studentData = student.attributes || student;
      const cursosRaw = (studentData as { cursos?: unknown[] | { data?: unknown[] } }).cursos || [];

      const cursosArray: unknown[] = Array.isArray(cursosRaw)
        ? cursosRaw
        : (cursosRaw as { data?: unknown[] }).data || [];

      cursosArray.forEach((course: unknown) => {
        const courseId =
          typeof course === "object" && course !== null && "id" in course
            ? (course as { id?: number; attributes?: { id?: number } }).id || (course as { id?: number; attributes?: { id?: number } }).attributes?.id
            : typeof course === "number"
            ? course
            : null;

        if (courseId) {
          const normalizedId =
            typeof courseId === "number"
              ? courseId
              : parseInt(String(courseId), 10);
          const courseStats = courseStudentCounts.get(normalizedId);
          if (courseStats) {
            courseStats.studentCount++;
          }
        }
      });
    });

    // Converter mapa para array e filtrar apenas cursos com alunos
    const result = Array.from(courseStudentCounts.values())
      .filter((course) => course.studentCount > 0)
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 4); // Top 4

    return NextResponse.json(
      { data: result },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", data: [] },
      { status: 500 }
    );
  }
}

