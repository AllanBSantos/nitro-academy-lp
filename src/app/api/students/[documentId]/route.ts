/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { findStudentByCPF } from "@/lib/strapi";

export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const cpf = params.documentId;

    if (!cpf) {
      return NextResponse.json({ error: "CPF não fornecido" }, { status: 400 });
    }

    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      return NextResponse.json({ error: "CPF inválido" }, { status: 400 });
    }

    let student = await findStudentByCPF(cleanCpf);

    const needsFallback =
      !student ||
      !student.nome ||
      !student.cpf_aluno ||
      !Array.isArray(student.cursos) ||
      student.cursos.length === 0;

    if (needsFallback) {
      const fallbackUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos?filters[cpf_aluno][$eq]=${cleanCpf}&filters[habilitado][$eq]=true&populate=*&publicationState=preview`;
      const fallbackResponse = await fetch(fallbackUrl, { cache: "no-store" });
      if (fallbackResponse.ok) {
        const fb = await fallbackResponse.json();
        const raw = fb?.data?.[0];
        if (raw) {
          const a = raw.attributes ?? raw;
          student = {
            id: raw.id,
            nome: a?.nome ?? "",
            data_nascimento: a?.data_nascimento ?? "",
            cpf_aluno: a?.cpf_aluno ?? "",
            responsavel: a?.responsavel ?? "",
            email_responsavel: a?.email_responsavel ?? "",
            cpf_responsavel: a?.cpf_responsavel ?? "",
            telefone_responsavel: a?.telefone_responsavel ?? "",
            pais: a?.pais ?? "",
            estado: a?.estado ?? "",
            cidade: a?.cidade ?? "",
            telefone_aluno: a?.telefone_aluno ?? "",
            portador_deficiencia: a?.portador_deficiencia ?? false,
            descricao_deficiencia: a?.descricao_deficiencia ?? "",
            escola_parceira: a?.escola_parceira ?? "",
            cursos: (a?.cursos?.data ?? a?.cursos ?? []).map((c: any) => ({
              id: c?.id,
              documentId: c?.documentId ?? c?.attributes?.documentId ?? "",
            })),
            turma: a?.turma ?? 0,
            publishedAt: a?.publishedAt ?? "",
            usou_voucher: a?.usou_voucher ?? false,
          };
        }
      }
    }

    if (!student) {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    const cursoAtual = student.cursos?.[0];

    const buildStudentPayload = (curso?: {
      id: number;
      titulo?: string;
      slug?: string;
    }) => ({
      id: student!.id!,
      documentId: student!.documentId,
      nome: student!.nome,
      cpf_aluno: student!.cpf_aluno,
      cursoAtual: {
        id: curso?.id || 0,
        titulo: curso?.titulo || "Sem matrícula",
        slug: curso?.slug || "",
      },
    });

    if (!cursoAtual) {
      const payload = buildStudentPayload();
      return NextResponse.json({ student: payload, success: true });
    }

    // Buscar curso preferindo documentId; fallback para ID. Tratar formatos com/sem attributes
    let curso: any | undefined;
    if (cursoAtual.documentId) {
      const byDocUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cursos?filters[documentId][$eq]=${cursoAtual.documentId}&locale=pt-BR&populate=*`;
      const byDocResp = await fetch(byDocUrl, { cache: "no-store" });
      if (byDocResp.ok) {
        const byDocData = await byDocResp.json();
        curso = byDocData?.data?.[0];
      }
    }

    if (!curso) {
      const byIdUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cursos/${cursoAtual.id}?populate=*`;
      const byIdResp = await fetch(byIdUrl, { cache: "no-store" });
      if (byIdResp.ok) {
        const byIdData = await byIdResp.json();
        curso = byIdData?.data;
      }
    }

    const attrs = curso?.attributes ?? curso;
    if (!attrs) {
      console.error(
        "[Students API] Não foi possível obter dados do curso (attrs vazio)"
      );
      const payload = buildStudentPayload();
      return NextResponse.json({ student: payload, success: true });
    }

    const payload = buildStudentPayload({
      id: curso?.id ?? attrs?.id ?? cursoAtual.id,
      titulo: attrs?.titulo ?? "",
      slug: attrs?.slug ?? "",
    });

    return NextResponse.json({ student: payload, success: true });
  } catch (error) {
    console.error("[Students API] Erro ao buscar aluno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
