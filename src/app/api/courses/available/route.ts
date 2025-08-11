import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get("locale") || "pt-BR";
    const maxPerClass = Number(
      process.env.NEXT_PUBLIC_MAX_STUDENTS_PER_CLASS || 15
    );

    const base = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    console.log("[Available] STRAPI URL:", base, "locale:", locale);

    // Buscar todos os cursos (preview para garantir retorno, com locale)
    const cursosUrl = `${base}/api/cursos?fields[0]=id&fields[1]=titulo&fields[2]=slug&fields[3]=nivel&fields[4]=inscricoes_abertas&fields[5]=documentId&populate[cronograma][fields][0]=dia_semana&populate[cronograma][fields][1]=horario_aula&populate[mentor][fields][0]=nome&locale=${locale}&publicationState=preview&pagination[pageSize]=1000`;

    const cursosResponse = await fetch(cursosUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("[Available] cursosResponse:", cursosResponse.status);

    if (!cursosResponse.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar cursos" },
        { status: 500 }
      );
    }

    const cursosData = await cursosResponse.json();
    const cursos = Array.isArray(cursosData?.data) ? cursosData.data : [];
    console.log("[Available] cursosData count:", cursos.length);

    // Buscar alunos habilitados para contar por curso
    const alunosUrl = `${base}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&publicationState=preview&pagination[pageSize]=1000`;
    const alunosResponse = await fetch(alunosUrl, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    console.log("[Available] alunosResponse:", alunosResponse.status);

    if (!alunosResponse.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar alunos" },
        { status: 500 }
      );
    }

    const alunosData = await alunosResponse.json();
    const alunos = Array.isArray(alunosData?.data) ? alunosData.data : [];
    console.log("[Available] alunosData count:", alunos.length);

    // Contagem de alunos por curso
    const alunosPorCurso: Record<string, number> = {};
    for (const aluno of alunos) {
      const cursosAluno =
        aluno?.attributes?.cursos?.data || aluno?.cursos || [];
      if (!Array.isArray(cursosAluno)) continue;
      for (const curso of cursosAluno) {
        const id = (curso?.id ?? "").toString();
        if (!id) continue;
        alunosPorCurso[id] = (alunosPorCurso[id] || 0) + 1;
      }
    }

    // Montar lista de cursos disponíveis
    const cursosDisponiveis = cursos
      .filter((curso: any) => {
        const attrs = curso?.attributes ?? curso;
        const cursoId = (curso?.id ?? attrs?.id ?? "").toString();
        if (!cursoId) return false;
        const inscritos = alunosPorCurso[cursoId] || 0;
        return attrs?.inscricoes_abertas === true && inscritos < maxPerClass;
      })
      .map((curso: any) => {
        const attrs = curso?.attributes ?? curso;
        const cursoId = curso?.id ?? attrs?.id;
        const inscritos = alunosPorCurso[(cursoId ?? "").toString()] || 0;
        const courseData = {
          id: cursoId,
          documentId: curso?.documentId ?? attrs?.documentId ?? "",
          titulo: attrs?.titulo || "",
          slug: attrs?.slug || "",
          nivel: attrs?.nivel || "",
          totalAlunos: maxPerClass,
          alunosMatriculados: inscritos,
          cronograma: attrs?.cronograma || null,
          mentor: attrs?.mentor?.data
            ? { nome: attrs?.mentor?.data?.attributes?.nome || "" }
            : attrs?.mentor
            ? { nome: attrs?.mentor?.nome || "" }
            : null,
        };

        console.log("[Available] Course mapped:", {
          id: courseData.id,
          documentId: courseData.documentId,
          titulo: courseData.titulo,
        });

        return courseData;
      })
      .sort((a: any, b: any) => a.alunosMatriculados - b.alunosMatriculados);

    console.log(
      "[Available] cursosDisponiveis count:",
      cursosDisponiveis.length
    );

    return NextResponse.json({
      courses: cursosDisponiveis,
      total: cursosDisponiveis.length,
      success: true,
    });
  } catch (error) {
    console.error("Erro ao buscar cursos disponíveis:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
