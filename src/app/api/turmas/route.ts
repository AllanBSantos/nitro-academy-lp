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
        console.log(`[Turmas API] Resposta do Strapi (turmas diretas):`, JSON.stringify(turmasResult, null, 2));
        
        const turmasArray = turmasResult.data || [];
        turmas = turmasArray
          .map((item: any) => {
            const itemData = item.attributes || item;
            return itemData.turma || item.turma;
          })
          .filter((t: any) => t !== undefined && t !== null && t !== "")
          .sort();
      }
    }

    // Se não encontrou turmas diretamente, buscar através dos alunos
    if (turmas.length === 0) {
      console.log(`[Turmas API] Não encontrou turmas diretamente, buscando através dos alunos...`);
      
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
        console.log(`[Turmas API] Resposta do Strapi (alunos):`, JSON.stringify(alunosResult, null, 2));

        const alunosArray = alunosResult.data || [];
        const turmasSet = new Set<string>();
        
        alunosArray.forEach((aluno: any) => {
          const alunoData = aluno.attributes || aluno;
          
          let turmaValue: string | null = null;
          
          if (alunoData.turma?.data) {
            const turmaData = alunoData.turma.data.attributes || alunoData.turma.data;
            turmaValue = turmaData?.turma || null;
          } else if (alunoData.turma?.turma) {
            turmaValue = alunoData.turma.turma;
          } else if (aluno.turma?.turma) {
            turmaValue = aluno.turma.turma;
          } else if (typeof alunoData.turma === 'string') {
            turmaValue = alunoData.turma;
          }
          
          if (turmaValue) {
            turmasSet.add(turmaValue);
          }
        });
        
        turmas = Array.from(turmasSet).sort();
      }
    }

    console.log(`[Turmas API] Escola: ${escola}, Turmas encontradas: ${turmas.length}`, turmas);

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
