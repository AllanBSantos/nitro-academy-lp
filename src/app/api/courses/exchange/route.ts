/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, studentDocumentId, newCourseId, newCourseDocumentId } =
      body;

    console.log("Exchange request received:", {
      studentId,
      studentDocumentId,
      newCourseId,
      newCourseDocumentId,
      env_strapi_url: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    });

    if (!studentId || !newCourseId) {
      return NextResponse.json(
        { error: "ID do aluno e ID do novo curso são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate numeric IDs
    if (isNaN(Number(studentId)) || isNaN(Number(newCourseId))) {
      console.log("Invalid IDs:", { studentId, newCourseId });
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    // Check target course availability (multiple lookup strategies)
    let cursoResponse: any;
    let foundCurso: any;

    // Strategy 1: search by documentId using filters (same config as "available" API)
    if (newCourseDocumentId) {
      const cursoByDocUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cursos?filters[documentId][$eq]=${newCourseDocumentId}&locale=pt-BR&publicationState=preview&populate=*`;
      console.log(
        "Trying to fetch course by documentId filter:",
        cursoByDocUrl
      );

      const cursoByDocResponse = await fetch(cursoByDocUrl, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        "Course by documentId response status:",
        cursoByDocResponse.status
      );

      if (cursoByDocResponse.ok) {
        const cursoByDocData = await cursoByDocResponse.json();
        console.log("DocumentId search response data:", cursoByDocData);
        if (cursoByDocData.data && cursoByDocData.data.length > 0) {
          foundCurso = cursoByDocData.data[0];
          cursoResponse = {
            ok: true,
            json: async () => ({ data: foundCurso }),
          };
          console.log("Found course by documentId filter:", foundCurso.id);
        } else {
          console.log(
            "No course found in documentId search, data length:",
            cursoByDocData.data?.length
          );
        }
      }
    }

    // Strategy 2: if not found by documentId, try by numeric ID
    if (!foundCurso) {
      const cursoByIdUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cursos/${newCourseId}?populate=*`;
      console.log("Trying to fetch course by ID:", cursoByIdUrl);

      cursoResponse = await fetch(cursoByIdUrl, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Course by ID response status:", cursoResponse.status);
    }

    // Strategy 3: fallback approaches if regular ID failed
    if (!foundCurso && (!cursoResponse || !cursoResponse.ok)) {
      console.log("Failed with regular ID, trying alternative approaches...");

      // Strategy 3A: use the exact "available API" listing pattern
      const availableApiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cursos?fields[0]=id&fields[1]=titulo&fields[2]=slug&fields[3]=nivel&fields[4]=inscricoes_abertas&fields[5]=documentId&populate[cronograma][fields][0]=dia_semana&populate[cronograma][fields][1]=horario_aula&populate[mentor][fields][0]=nome&locale=pt-BR&publicationState=preview&pagination[pageSize]=1000`;
      console.log(
        "Trying to fetch courses using available API pattern:",
        availableApiUrl
      );

      const availableApiResponse = await fetch(availableApiUrl, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        "Available API pattern response status:",
        availableApiResponse.status
      );

      if (availableApiResponse.ok) {
        const availableApiData = await availableApiResponse.json();
        console.log("Available API pattern raw data:", availableApiData);

        if (availableApiData.data && availableApiData.data.length > 0) {
          const targetCourse = availableApiData.data.find((course: any) => {
            const courseId = course.id || course.attributes?.id;
            const courseDocumentId =
              course.documentId || course.attributes?.documentId;

            console.log("Checking available API course:", {
              id: courseId,
              documentId: courseDocumentId,
              titulo: course.attributes?.titulo || course.titulo,
            });

            return (
              courseId === newCourseId ||
              courseDocumentId === newCourseDocumentId
            );
          });

          if (targetCourse) {
            console.log(
              "Found course using available API pattern:",
              targetCourse
            );
            foundCurso = targetCourse;
            cursoResponse = {
              ok: true,
              json: async () => ({ data: targetCourse }),
            };
          }
        }
      }

      // Strategy 3B: global listing fallback if still not found
      if (!foundCurso) {
        const allCoursesUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cursos?locale=pt-BR&publicationState=preview&populate=*&pagination[pageSize]=1000`;
        console.log("Trying to fetch all courses:", allCoursesUrl);

        const allCoursesResponse = await fetch(allCoursesUrl, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("All courses response status:", allCoursesResponse.status);

        if (allCoursesResponse.ok) {
          const allCoursesData = await allCoursesResponse.json();
          console.log("All courses raw data:", allCoursesData);
          console.log("Total courses found:", allCoursesData.data?.length);
          console.log(
            "Looking for course with ID:",
            newCourseId,
            "or documentId:",
            newCourseDocumentId
          );

          // Try matching by ID or documentId
          const targetCourse = allCoursesData.data?.find((course: any) => {
            const courseId = course.id || course.attributes?.id;
            const courseDocumentId =
              course.documentId || course.attributes?.documentId;

            console.log("Checking course:", {
              id: courseId,
              documentId: courseDocumentId,
              titulo: course.attributes?.titulo || course.titulo,
            });

            return (
              courseId === newCourseId ||
              courseDocumentId === newCourseDocumentId
            );
          });

          if (targetCourse) {
            console.log("Found course in all courses list:", {
              id: targetCourse.id,
              documentId: targetCourse.documentId,
              titulo: targetCourse.attributes?.titulo || targetCourse.titulo,
            });
            // Simulate a successful response object
            foundCurso = targetCourse;
            cursoResponse = {
              ok: true,
              json: async () => ({ data: targetCourse }),
            } as any;
          } else {
            console.log("Course not found in all courses list");
            // Log first 3 items for debugging
            if (allCoursesData.data?.length > 0) {
              console.log(
                "Sample courses (first 3):",
                allCoursesData.data.slice(0, 3).map((c: any) => ({
                  id: c.id,
                  documentId: c.documentId,
                  titulo: c.attributes?.titulo || c.titulo,
                }))
              );
            }
          }
        }
      }
    } // <-- properly closes the alternative approaches block

    if (!foundCurso) {
      console.error(
        "Erro ao buscar curso: Curso não encontrado em nenhuma das abordagens"
      );
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    const curso = foundCurso;
    const cursoAttr = (curso as any)?.attributes ?? (curso as any);

    if (!curso || !cursoAttr) {
      return NextResponse.json(
        { error: "Dados do curso inválidos" },
        { status: 404 }
      );
    }

    // Must be open for enrollment
    if (!cursoAttr.inscricoes_abertas) {
      return NextResponse.json(
        { error: "Este curso não está mais aceitando inscrições" },
        { status: 400 }
      );
    }

    // Count current students in the target course
    const alunosResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos?filters[cursos][id][$eq]=${newCourseId}&populate=*&pagination[pageSize]=1000`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!alunosResponse.ok) {
      console.error(
        "Erro ao verificar vagas:",
        alunosResponse.status,
        alunosResponse.statusText
      );
      return NextResponse.json(
        { error: "Erro ao verificar vagas do curso" },
        { status: 500 }
      );
    }

    const alunosData = await alunosResponse.json();
    const alunosNoCurso =
      alunosData.data?.filter((aluno: any) => aluno.attributes?.habilitado) ||
      [];

    if (alunosNoCurso.length >= 15) {
      return NextResponse.json(
        { error: "Este curso não possui mais vagas disponíveis" },
        { status: 400 }
      );
    }

    // Fetch current student (prefer documentId; fallback to id filter)
    const alunoUrl = studentDocumentId
      ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos?filters[documentId][$eq]=${studentDocumentId}&populate=*&publicationState=preview`
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos?filters[id][$eq]=${studentId}&populate=*`;

    console.log("Fetching aluno with:", alunoUrl);

    const alunoResponse = await fetch(alunoUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!alunoResponse.ok) {
      console.error(
        "Erro ao buscar aluno:",
        alunoResponse.status,
        alunoResponse.statusText
      );
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    const alunoData = await alunoResponse.json();
    const aluno = Array.isArray(alunoData.data)
      ? alunoData.data[0]
      : alunoData.data;
    const alunoAttr = (aluno as any)?.attributes ?? (aluno as any);

    if (!alunoAttr) {
      return NextResponse.json(
        { error: "Dados do aluno inválidos" },
        { status: 404 }
      );
    }

    // Current course id for this student (normalized)
    const cursoAtualId = alunoAttr.cursos?.[0]?.id;

    if (!cursoAtualId) {
      return NextResponse.json(
        { error: "Aluno não está matriculado em nenhum curso" },
        { status: 400 }
      );
    }

    // Avoid switching to the same course
    if (cursoAtualId === newCourseId) {
      return NextResponse.json(
        { error: "Você já está matriculado neste curso" },
        { status: 400 }
      );
    }

    // Fetch new course (by ID) to get attributes like title
    const novoCursoResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cursos/${newCourseId}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!novoCursoResponse.ok) {
      console.error(
        "Erro ao buscar novo curso:",
        novoCursoResponse.status,
        novoCursoResponse.statusText
      );
      return NextResponse.json(
        { error: "Erro ao buscar informações do novo curso" },
        { status: 500 }
      );
    }

    const novoCursoData = await novoCursoResponse.json();
    const novoCurso = novoCursoData.data;
    const novoCursoAttr = (novoCurso as any)?.attributes ?? (novoCurso as any);

    if (!novoCurso || !novoCursoAttr) {
      return NextResponse.json(
        { error: "Dados do novo curso inválidos" },
        { status: 500 }
      );
    }

    // Update student linking: disconnect current and connect new
    const updateUrl = studentDocumentId
      ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos/${studentDocumentId}`
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos/${studentId}`;

    console.log("Updating student at URL:", updateUrl);

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          cursos: {
            disconnect: [cursoAtualId],
            connect: [newCourseId],
          },
        },
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      console.error("Erro ao atualizar aluno:", errorData);
      return NextResponse.json(
        { error: "Erro ao realizar troca de curso" },
        { status: 500 }
      );
    }

    // Audit log
    console.log(
      `Aluno ${alunoAttr.nome} (ID: ${studentId}) trocou do curso ${cursoAtualId} para o curso ${newCourseId}`
    );

    return NextResponse.json({
      success: true,
      message: "Troca de curso realizada com sucesso",
      data: {
        studentId,
        oldCourseId: cursoAtualId,
        newCourseId,
        newCourseTitle: (novoCursoAttr as any).titulo,
      },
    });
  } catch (error) {
    console.error("Erro ao realizar troca de curso:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
