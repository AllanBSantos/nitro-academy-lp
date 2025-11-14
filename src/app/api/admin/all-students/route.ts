import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

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

    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "STRAPI_TOKEN não configurado" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const curso = searchParams.get("curso");
    const escola = searchParams.get("escola");
    const cursoId = searchParams.get("cursoId");

    let url = `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=titulo&fields[0]=nome&fields[1]=telefone_aluno&fields[2]=responsavel&fields[3]=telefone_responsavel&fields[4]=escola_parceira&fields[5]=turma&fields[6]=createdAt&fields[7]=updatedAt&pagination[pageSize]=1000&publicationState=preview`;

    if (search) {
      url += `&filters[nome][$containsi]=${encodeURIComponent(search)}`;
    }

    if (curso) {
      url += `&filters[cursos][titulo][$containsi]=${encodeURIComponent(
        curso
      )}`;
    }

    if (escola) {
      url += `&filters[escola_parceira][$containsi]=${encodeURIComponent(
        escola
      )}`;
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch alunos: ${response.status}`);
    }

    const data = await response.json();
    let alunos = data?.data || [];

    if (cursoId) {
      const cursoIdNum = parseInt(cursoId, 10);
      alunos = alunos.filter((aluno: any) => {
        try {
          const alunoData = aluno.attributes || aluno;
          const cursosRaw = alunoData.cursos || aluno.cursos;
          
          if (!cursosRaw) return false;
          
          const cursos = Array.isArray(cursosRaw) 
            ? cursosRaw 
            : cursosRaw?.data || [];
          
          if (!Array.isArray(cursos) || cursos.length === 0) return false;
          
          return cursos.some((c: any) => {
            let cId: number | null = null;
            
            if (typeof c === 'number') {
              cId = c;
            } else if (typeof c === 'string') {
              cId = parseInt(c, 10) || null;
            } else if (c?.id) {
              cId = typeof c.id === 'number' ? c.id : parseInt(c.id, 10) || null;
            } else if (c?.attributes?.id) {
              cId = typeof c.attributes.id === 'number' ? c.attributes.id : parseInt(c.attributes.id, 10) || null;
            } else if (c?.data?.id) {
              cId = typeof c.data.id === 'number' ? c.data.id : parseInt(c.data.id, 10) || null;
            }
            
            return cId !== null && cId === cursoIdNum;
          });
        } catch {
          return false;
        }
      });
    }

    const alunosFormatados: AlunoHabilitado[] = alunos
      .map((aluno: any) => {
        try {
          const alunoData = aluno.attributes || aluno;
          const cursosRaw = alunoData.cursos || aluno.cursos;
          
          const cursosArray = Array.isArray(cursosRaw) 
            ? cursosRaw 
            : cursosRaw?.data || [];
          
          const cursosFormatados = cursosArray
            .map((curso: any) => {
              try {
                let cursoId: number = 0;
                
                if (typeof curso === 'number') {
                  cursoId = curso;
                } else if (typeof curso === 'string') {
                  cursoId = parseInt(curso, 10) || 0;
                } else if (curso?.id) {
                  cursoId = typeof curso.id === 'number' ? curso.id : parseInt(curso.id, 10) || 0;
                } else if (curso?.attributes?.id) {
                  cursoId = typeof curso.attributes.id === 'number' ? curso.attributes.id : parseInt(curso.attributes.id, 10) || 0;
                } else if (curso?.data?.id) {
                  cursoId = typeof curso.data.id === 'number' ? curso.data.id : parseInt(curso.data.id, 10) || 0;
                }
                
                const cursoTitulo = curso?.titulo || curso?.attributes?.titulo || curso?.data?.attributes?.titulo || "";
                
                return {
                  id: cursoId,
                  titulo: cursoTitulo,
                };
              } catch {
                return null;
              }
            })
            .filter((c: any) => c !== null && c.id > 0);

          return {
            id: aluno.id || alunoData.id || 0,
            nome: alunoData.nome || "",
            telefone_aluno: alunoData.telefone_aluno || "",
            responsavel: alunoData.responsavel || "",
            telefone_responsavel: alunoData.telefone_responsavel || "",
            cursos: cursosFormatados,
            escola_parceira: alunoData.escola_parceira || "",
            turma: alunoData.turma || undefined,
            createdAt: alunoData.createdAt || aluno.createdAt || "",
            updatedAt: alunoData.updatedAt || aluno.updatedAt || "",
          };
        } catch {
          return null;
        }
      })
      .filter((aluno: any) => aluno !== null && aluno.id > 0);

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
