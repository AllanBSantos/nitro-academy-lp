import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

interface AlunoHabilitado {
  id: number;
  nome: string;
  telefone_aluno?: string;
  responsavel: string;
  telefone_responsavel: string;
  cursos: Array<{
    id: number;
    titulo: string;
  }>;
  escola_parceira?: string;
  turma?: number;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    if (!STRAPI_API_URL) {
      return NextResponse.json(
        { error: "STRAPI_API_URL não configurada" },
        { status: 500 }
      );
    }

    // Extrair  parâmetros de filtro da query string
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const curso = searchParams.get("curso");
    const escola = searchParams.get("escola");

    // Construir URL base
    let url = `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=titulo&fields[0]=nome&fields[1]=telefone_aluno&fields[2]=responsavel&fields[3]=telefone_responsavel&fields[4]=escola_parceira&fields[5]=turma&fields[6]=createdAt&fields[7]=updatedAt&pagination[pageSize]=1000&publicationState=preview`;

    // Adicionar filtro de pesquisa por nome
    if (search) {
      url += `&filters[nome][$containsi]=${encodeURIComponent(search)}`;
    }

    // Adicionar filtro por curso
    if (curso) {
      url += `&filters[cursos][titulo][$containsi]=${encodeURIComponent(
        curso
      )}`;
    }

    // Adicionar filtro por escola
    if (escola) {
      url += `&filters[escola_parceira][$containsi]=${encodeURIComponent(
        escola
      )}`;
    }

    // Buscar todos os alunos habilitados com os dados necessários
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`Failed to fetch alunos: ${response.status}`);
    }

    const data = await response.json();
    const alunos = data.data || [];

    // Formatar os dados para retorno
    const alunosFormatados: AlunoHabilitado[] = alunos.map(
      (aluno: {
        id: number;
        nome?: string;
        telefone_aluno?: string;
        responsavel?: string;
        telefone_responsavel?: string;
        cursos?: Array<{ id: number; titulo?: string }>;
        escola_parceira?: string;
        turma?: number;
        createdAt?: string;
        updatedAt?: string;
      }) => ({
        id: aluno.id,
        nome: aluno.nome || "",
        telefone_aluno: aluno.telefone_aluno || "",
        responsavel: aluno.responsavel || "",
        telefone_responsavel: aluno.telefone_responsavel || "",
        cursos: (aluno.cursos || []).map(
          (curso: { id: number; titulo?: string }) => ({
            id: curso.id,
            titulo: curso.titulo || "",
          })
        ),
        escola_parceira: aluno.escola_parceira || "",
        turma: aluno.turma || undefined,
        createdAt: aluno.createdAt || "",
        updatedAt: aluno.updatedAt || "",
      })
    );

    return NextResponse.json(
      { data: alunosFormatados },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching all students:", error);
    return NextResponse.json(
      { error: "Erro ao buscar alunos" },
      { status: 500 }
    );
  }
}
