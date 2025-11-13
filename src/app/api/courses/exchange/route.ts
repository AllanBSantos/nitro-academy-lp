/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { studentId, studentDocumentId, newCourseId, newCourseDocumentId } =
      body;

    if (!studentId || !newCourseId) {
      return NextResponse.json(
        { error: "ID do aluno e ID do novo curso são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate numeric IDs
    if (isNaN(Number(studentId)) || isNaN(Number(newCourseId))) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    // Check target course availability (multiple lookup strategies)
    let cursoResponse: any;
    let foundCurso: any;

    // Strategy 1: search by documentId using filters (same config as "available" API)
    if (newCourseDocumentId) {
      const cursoByDocUrl = `${STRAPI_API_URL}/api/cursos?filters[documentId][$eq]=${newCourseDocumentId}&locale=pt-BR&populate=*`;

      const cursoByDocResponse = await fetch(cursoByDocUrl, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });

      if (cursoByDocResponse.ok) {
        const cursoByDocData = await cursoByDocResponse.json();
        if (cursoByDocData.data && cursoByDocData.data.length > 0) {
          foundCurso = cursoByDocData.data[0];
          cursoResponse = {
            ok: true,
            json: async () => ({ data: foundCurso }),
          };
        }
      }
    }

    // Strategy 2: if not found by documentId, try by numeric ID
    if (!foundCurso) {
      const cursoByIdUrl = `${STRAPI_API_URL}/api/cursos/${newCourseId}?populate=*`;

      cursoResponse = await fetch(cursoByIdUrl, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });
    }

    // Strategy 3: fallback approaches if regular ID failed
    if (!foundCurso && (!cursoResponse || !cursoResponse.ok)) {
      // Strategy 3A: use the exact "available API" listing pattern
      const availableApiUrl = `${STRAPI_API_URL}/api/cursos?filters[habilitado][$eq]=true&fields[0]=id&fields[1]=titulo&fields[2]=slug&fields[3]=nivel&fields[4]=inscricoes_abertas&fields[5]=documentId&populate[cronograma][fields][0]=dia_semana&populate[cronograma][fields][1]=horario_aula&populate[mentor][fields][0]=nome&locale=pt-BR&pagination[pageSize]=1000`;

      const availableApiResponse = await fetch(availableApiUrl, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });

      if (availableApiResponse.ok) {
        const availableApiData = await availableApiResponse.json();

        if (availableApiData.data && availableApiData.data.length > 0) {
          const targetCourse = availableApiData.data.find((course: any) => {
            const courseId = course.id || course.attributes?.id;
            const courseDocumentId =
              course.documentId || course.attributes?.documentId;

            return (
              courseId === newCourseId ||
              courseDocumentId === newCourseDocumentId
            );
          });

          if (targetCourse) {
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
        const allCoursesUrl = `${STRAPI_API_URL}/api/cursos?locale=pt-BR&populate=*&pagination[pageSize]=1000`;

        const allCoursesResponse = await fetch(allCoursesUrl, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        });

        if (allCoursesResponse.ok) {
          const allCoursesData = await allCoursesResponse.json();

          // Try matching by ID or documentId
          const targetCourse = allCoursesData.data?.find((course: any) => {
            const courseId = course.id || course.attributes?.id;
            const courseDocumentId =
              course.documentId || course.attributes?.documentId;

            return (
              courseId === newCourseId ||
              courseDocumentId === newCourseDocumentId
            );
          });

          if (targetCourse) {
            // Simulate a successful response object
            foundCurso = targetCourse;
            cursoResponse = {
              ok: true,
              json: async () => ({ data: targetCourse }),
            } as any;
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
      `${STRAPI_API_URL}/api/alunos?filters[cursos][id][$eq]=${newCourseId}&filters[habilitado][$eq]=true&populate=*&publicationState=preview&pagination[pageSize]=1000`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
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
    const alunosNoCurso = alunosData.data || [];

    if (alunosNoCurso.length >= 15) {
      return NextResponse.json(
        { error: "Este curso não possui mais vagas disponíveis" },
        { status: 400 }
      );
    }

    // Fetch current student (prefer documentId; fallback to id filter)
    const alunoUrl = studentDocumentId
      ? `${STRAPI_API_URL}/api/alunos?filters[documentId][$eq]=${studentDocumentId}&populate=*&publicationState=preview`
      : `${STRAPI_API_URL}/api/alunos?filters[id][$eq]=${studentId}&populate=*&publicationState=preview`;

    const alunoResponse = await fetch(alunoUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
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

    // Current course for this student (normalized for both shapes)
    const cursosRelation = (alunoAttr as any)?.cursos?.data
      ? (alunoAttr as any).cursos.data
      : (alunoAttr as any)?.cursos || [];
    const firstCurso = Array.isArray(cursosRelation) ? cursosRelation[0] : null;
    const cursoAtualId =
      (firstCurso && (firstCurso.id ?? firstCurso?.attributes?.id)) ||
      (alunoAttr as any)?.cursos?.[0]?.id ||
      null;
    const cursoAtualTitulo =
      (firstCurso &&
        (firstCurso?.attributes?.titulo ?? firstCurso?.titulo ?? null)) ||
      null;

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

    // Reuse the previously fetched course data to avoid locale-related 404s
    const novoCursoAttr = cursoAttr;

    // Update student linking: disconnect current and connect new
    const alunoIdForUpdate = (aluno as any)?.id ?? Number(studentId);
    const alunoDocumentIdForUpdate =
      (aluno as any)?.documentId ?? (alunoAttr as any)?.documentId;
    if (!alunoIdForUpdate || Number.isNaN(Number(alunoIdForUpdate))) {
      return NextResponse.json(
        { error: "ID do aluno inválido para atualização" },
        { status: 400 }
      );
    }

    const updateUrl = `${STRAPI_API_URL}/api/alunos/${
      alunoDocumentIdForUpdate || alunoIdForUpdate
    }`;

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          // Replace relation completely so only the new course remains
          cursos: {
            set: [{ id: newCourseId }],
          },
          // Ensure published version mirrors draft
          publishedAt: new Date().toISOString(),
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

    // Notify via email
    try {
      const enrollmentEmail = process.env.NEXT_PUBLIC_ENROLLMENT_EMAIL;
      if (enrollmentEmail) {
        const emailSubject = `Troca de curso realizada para ${alunoAttr.nome}`;
        const emailText = `Olá,\n\nO aluno ${
          alunoAttr.nome
        } (ID: ${studentId}) realizou uma troca de curso.\n\nCurso anterior: ${
          cursoAtualTitulo || cursoAtualId
        }\nNovo curso: ${newCourseId} - ${
          (novoCursoAttr as any).titulo
        }\n\nCPF do aluno: ${
          (alunoAttr as any).cpf_aluno || "-"
        }\nResponsável: ${
          (alunoAttr as any).responsavel || "-"
        }\nEmail do responsável: ${
          (alunoAttr as any).email_responsavel || "-"
        }\nTelefone do responsável: ${
          (alunoAttr as any).telefone_responsavel || "-"
        }\n\nAtt,\nSistema Nitro Academy`;
        const origin =
          request.headers.get("origin") ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "http://localhost:5173";

        await fetch(`${origin}/api/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: enrollmentEmail,
            subject: emailSubject,
            text: emailText,
          }),
        });
      } else {
        console.warn(
          "NEXT_PUBLIC_ENROLLMENT_EMAIL não definido. Email não enviado."
        );
      }
    } catch (emailError) {
      console.error(
        "Falha ao enviar email de notificação de troca:",
        emailError
      );
      // Prossegue sem falhar a troca
    }

    return NextResponse.json({
      success: true,
      message: "Troca de curso realizada com sucesso",
      data: {
        studentId,
        oldCourseId: cursoAtualId,
        oldCourseTitle: cursoAtualTitulo,
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
