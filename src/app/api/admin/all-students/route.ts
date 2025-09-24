import { NextResponse } from "next/server";

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
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  try {
    if (!STRAPI_API_URL) {
      return NextResponse.json(
        { error: "STRAPI_API_URL não configurada" },
        { status: 500 }
      );
    }

    // Buscar todos os alunos habilitados com os dados necessários
    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=titulo&fields[0]=nome&fields[1]=telefone_aluno&fields[2]=responsavel&fields[3]=telefone_responsavel&fields[4]=createdAt&fields[5]=updatedAt&pagination[pageSize]=1000&publicationState=preview`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
