import { NextResponse } from "next/server";

interface Aluno {
  id: number;
  documentId: string;
  nome: string;
  email_responsavel: string;
  responsavel: string;
  telefone_responsavel: string;
  createdAt: string;
  habilitado: boolean;
  cursos: Curso[];
  escola_parceira?: string;
}

interface Curso {
  id: number;
  titulo: string;
  slug: string;
  nivel: string;
}

interface AlunoExcedente {
  id: number;
  documentId: string;
  nome: string;
  email: string;
  responsavel: string;
  telefone: string;
  createdAt: string;
  habilitado: boolean;
  escola?: string;
}

interface CursoComExcedentes {
  cursoId: number;
  titulo: string;
  slug: string;
  nivel: string;
  totalAlunos: number;
  alunosMatriculados: number;
  alunosExcedentes: number;
  listaExcedentes: AlunoExcedente[];
}

interface ExceededReportData {
  cursosComExcedentes: CursoComExcedentes[];
  totalExcedentes: number;
  totalAlunosHabilitados: number;
  percentualExcedentes: number;
}

async function buscarTodosAlunos(baseURL: string): Promise<Aluno[]> {
  let todosAlunos: Aluno[] = [];
  let pagina = 1;
  const tamanhoPagina = 100;

  while (true) {
    try {
      const response = await fetch(
        `${baseURL}/api/alunos?populate=*&pagination[page]=${pagina}&pagination[pageSize]=${tamanhoPagina}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const alunos = data.data;

      if (!alunos || !Array.isArray(alunos) || alunos.length === 0) {
        break;
      }

      todosAlunos = todosAlunos.concat(alunos);

      const paginacao = data.meta.pagination;
      if (pagina >= paginacao.pageCount) {
        break;
      }

      pagina++;
    } catch (error) {
      console.error(`Erro ao buscar página ${pagina}:`, error);
      break;
    }
  }

  return todosAlunos;
}

export async function GET() {
  try {
    const baseURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    if (!baseURL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_STRAPI_API_URL não configurada" },
        { status: 500 }
      );
    }

    // Buscar todos os alunos
    const alunos = await buscarTodosAlunos(baseURL);

    if (!alunos || !Array.isArray(alunos)) {
      return NextResponse.json(
        { error: "Nenhum aluno encontrado" },
        { status: 404 }
      );
    }

    // Filtrar apenas alunos habilitados
    const alunosHabilitados = alunos.filter(
      (aluno) => aluno.habilitado === true
    );

    // Agrupar alunos por curso
    const alunosPorCurso: {
      [key: number]: {
        titulo: string;
        slug: string;
        nivel: string;
        alunos: AlunoExcedente[];
      };
    } = {};

    alunosHabilitados.forEach((aluno) => {
      // Suporta formatos com e sem 'attributes'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attrs: any = (aluno as any)?.attributes ?? aluno;
      const escolaParceira: string = attrs?.escola_parceira ?? "";
      const cursos = aluno.cursos || [];
      cursos.forEach((curso: Curso) => {
        const cursoId = curso.id;
        const cursoTitulo = curso.titulo || "Curso sem título";

        if (!alunosPorCurso[cursoId]) {
          alunosPorCurso[cursoId] = {
            titulo: cursoTitulo,
            slug: curso.slug || "",
            nivel: curso.nivel || "",
            alunos: [],
          };
        }

        alunosPorCurso[cursoId].alunos.push({
          id: aluno.id,
          documentId: aluno.documentId,
          nome: attrs?.nome ?? aluno.nome,
          email: attrs?.email_responsavel ?? aluno.email_responsavel,
          responsavel: attrs?.responsavel ?? aluno.responsavel,
          telefone: attrs?.telefone_responsavel ?? aluno.telefone_responsavel,
          createdAt: attrs?.createdAt ?? aluno.createdAt,
          habilitado: attrs?.habilitado ?? aluno.habilitado,
          escola: escolaParceira,
        });
      });
    });

    // Ordenar alunos por data de criação e identificar excedentes
    const cursosComExcedentes: CursoComExcedentes[] = [];
    const MAX_ALUNOS_POR_CURSO = 15;

    Object.entries(alunosPorCurso).forEach(([cursoId, curso]) => {
      // Ordenar alunos por createdAt (mais antigo primeiro)
      curso.alunos.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const totalAlunos = curso.alunos.length;
      const alunosMatriculados = curso.alunos.slice(0, MAX_ALUNOS_POR_CURSO);
      const alunosExcedentes = curso.alunos.slice(MAX_ALUNOS_POR_CURSO);

      if (alunosExcedentes.length > 0) {
        cursosComExcedentes.push({
          cursoId: parseInt(cursoId),
          titulo: curso.titulo,
          slug: curso.slug,
          nivel: curso.nivel,
          totalAlunos,
          alunosMatriculados: alunosMatriculados.length,
          alunosExcedentes: alunosExcedentes.length,
          listaExcedentes: alunosExcedentes,
        });
      }
    });

    // Ordenar por quantidade de excedentes (maior para menor)
    cursosComExcedentes.sort((a, b) => b.alunosExcedentes - a.alunosExcedentes);

    // Calcular estatísticas
    const totalExcedentes = cursosComExcedentes.reduce(
      (total, curso) => total + curso.alunosExcedentes,
      0
    );

    const percentualExcedentes =
      alunosHabilitados.length > 0
        ? (totalExcedentes / alunosHabilitados.length) * 100
        : 0;

    const reportData: ExceededReportData = {
      cursosComExcedentes,
      totalExcedentes,
      totalAlunosHabilitados: alunosHabilitados.length,
      percentualExcedentes,
    };

    return NextResponse.json({ data: reportData });
  } catch (error) {
    console.error("Erro ao gerar relatório de alunos excedentes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
