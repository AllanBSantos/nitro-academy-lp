import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const escola = searchParams.get("escola");

    if (!escola) {
      return NextResponse.json(
        { error: "Parâmetro 'escola' é obrigatório" },
        { status: 400 }
      );
    }

    // Tentar buscar turmas diretamente da collection turmas
    // Primeiro, buscar a escola pelo nome para obter o ID
    const escolaUrl = `${STRAPI_API_URL}/api/escolas?filters[nome][$eq]=${encodeURIComponent(escola)}`;
    
    const escolaResponse = await fetch(escolaUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    let escolaId: number | null = null;
    if (escolaResponse.ok) {
      const escolaData = await escolaResponse.json();
      const escolaItem = escolaData.data?.[0];
      if (escolaItem) {
        escolaId = escolaItem.id || escolaItem.documentId;
      }
    }

    // Se encontrou a escola, buscar turmas diretamente
    let turmas: string[] = [];
    
    if (escolaId) {
      const turmasUrl = `${STRAPI_API_URL}/api/turmas?filters[escola][id][$eq]=${escolaId}&populate=escola&sort=turma:asc`;
      
      const turmasResponse = await fetch(turmasUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (turmasResponse.ok) {
        const turmasResult = await turmasResponse.json();
        
        interface TurmaItem {
          id?: number;
          attributes?: {
            turma?: string;
          };
          turma?: string;
        }

        const turmasArray = turmasResult.data || [];
        turmas = turmasArray
          .map((item: TurmaItem) => {
            const itemData = item.attributes || item;
            return itemData.turma || item.turma;
          })
          .filter((t: string | undefined): t is string => t !== undefined && t !== null && t !== "")
          .sort();
      }
    }

    // Se não encontrou turmas diretamente, buscar através dos alunos
    if (turmas.length === 0) {
      const alunosUrl = `${STRAPI_API_URL}/api/alunos-escola-parceira?filters[escola][nome][$eq]=${encodeURIComponent(
        escola
      )}&populate[turma]=*&populate[escola]=*&pagination[pageSize]=10000`;

      const alunosResponse = await fetch(alunosUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (alunosResponse.ok) {
        const alunosResult = await alunosResponse.json();

        interface AlunoItem {
          attributes?: {
            turma?: {
              data?: {
                attributes?: {
                  turma?: string;
                };
              };
              turma?: string;
            } | string;
          };
          turma?: {
            turma?: string;
          } | string;
        }

        const alunosArray = alunosResult.data || [];
        const turmasSet = new Set<string>();
        
        alunosArray.forEach((aluno: AlunoItem) => {
          const alunoData = aluno.attributes || aluno;
          
          let turmaValue: string | null = null;
          
          const turmaData = alunoData.turma;
          if (typeof turmaData === 'string') {
            turmaValue = turmaData;
          } else if (turmaData && typeof turmaData === 'object') {
            if ('data' in turmaData && turmaData.data) {
              const dataAttrs = turmaData.data.attributes || turmaData.data;
              if (dataAttrs && typeof dataAttrs === 'object' && 'turma' in dataAttrs) {
                turmaValue = dataAttrs.turma || null;
              }
            } else if ('turma' in turmaData) {
              turmaValue = turmaData.turma || null;
            }
          }
          
          // Fallback para item.turma se não encontrou em alunoData
          if (!turmaValue) {
            const turmaItem = aluno.turma;
            if (typeof turmaItem === 'string') {
              turmaValue = turmaItem;
            } else if (turmaItem && typeof turmaItem === 'object' && 'turma' in turmaItem) {
              turmaValue = turmaItem.turma || null;
            }
          }
          
          if (turmaValue) {
            turmasSet.add(turmaValue);
          }
        });
        
        turmas = Array.from(turmasSet).sort();
      }
    }

    return NextResponse.json({
      success: true,
      data: turmas,
      count: turmas.length,
    });
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
