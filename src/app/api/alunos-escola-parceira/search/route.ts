import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cpf = searchParams.get("cpf");
    const nome = searchParams.get("nome");
    const escola = searchParams.get("escola");
    const turma = searchParams.get("turma");

    console.log(`[Search API] Parâmetros recebidos:`, { cpf, nome, escola, turma });

    if (!cpf && !nome) {
      return NextResponse.json(
        { error: "Parâmetro 'cpf' ou 'nome' é obrigatório" },
        { status: 400 }
      );
    }

    // Construir filtros básicos (CPF e nome) - sem filtros de relação para evitar erro 500
    // Vamos filtrar por escola e turma no código após buscar os dados
    let filters: string[] = [];

    if (cpf) {
      filters.push(`filters[cpf][$eq]=${encodeURIComponent(cpf)}`);
    }

    // Para busca por nome, vamos buscar todos e filtrar no código para suportar busca por palavras parciais
    // Se for CPF, podemos usar filtro direto
    const filtersString = filters.length > 0 ? filters.join("&") : "";
    let url = `${STRAPI_API_URL}/api/alunos-escola-parceira?${filtersString}&populate=escola&populate=turma&pagination[pageSize]=10000`;

    console.log(`[Search API] URL completa (sem filtros de relação):`, url);

    // Preparar headers com autenticação se disponível
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (ADMIN_TOKEN) {
      headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[Search API] Erro na resposta: ${response.status}`, errorText);
      return NextResponse.json(
        { error: "Erro ao buscar aluno", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`[Search API] Resposta do Strapi:`, JSON.stringify(result, null, 2));
    
    const alunosArray = result.data || [];
    console.log(`[Search API] Total de alunos retornados (antes do filtro): ${alunosArray.length}`);

    // Normalizar estrutura e filtrar por escola/turma no código (já que filtros de relação causam erro 500)
    const alunosNormalizados = alunosArray.map((item: any) => {
      const itemData = item.attributes || item;
      const escolaNome = itemData.escola?.nome || itemData.escola?.data?.attributes?.nome || itemData.escola || item.escola?.nome || item.escola;
      const turmaNome = itemData.turma?.turma || itemData.turma?.data?.attributes?.turma || itemData.turma || item.turma?.turma || item.turma;
      
      return {
        id: item.id || itemData.id,
        nome: itemData.nome || item.nome,
        cpf: itemData.cpf || item.cpf,
        escola: escolaNome,
        turma: turmaNome,
      };
    });

    // Filtrar por nome no código se fornecido (suporta busca por palavras parciais)
    let alunos = alunosNormalizados;
    
    if (nome) {
      // Dividir o nome de busca em palavras e verificar se todas estão presentes
      const palavrasBusca = nome
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((palavra: string) => palavra.length > 0);
      
      alunos = alunos.filter((aluno: any) => {
        const alunoNome = (aluno.nome || "").toLowerCase();
        // Verificar se todas as palavras da busca estão presentes no nome do aluno
        return palavrasBusca.every((palavra: string) => alunoNome.includes(palavra));
      });
      console.log(`[Search API] Após filtrar por nome "${nome}" (${palavrasBusca.length} palavras): ${alunos.length} alunos`);
    }

    // Filtrar por escola e turma no código se fornecidos
    
    if (escola) {
      alunos = alunos.filter((aluno: any) => {
        const alunoEscola = aluno.escola?.toLowerCase().trim() || "";
        const escolaBusca = escola.toLowerCase().trim();
        return alunoEscola === escolaBusca;
      });
      console.log(`[Search API] Após filtrar por escola "${escola}": ${alunos.length} alunos`);
    }

    if (turma) {
      alunos = alunos.filter((aluno: any) => {
        const alunoTurma = aluno.turma?.toLowerCase().trim() || "";
        const turmaBusca = turma.toLowerCase().trim();
        return alunoTurma === turmaBusca;
      });
      console.log(`[Search API] Após filtrar por turma "${turma}": ${alunos.length} alunos`);
    }

    console.log(`[Search API] Alunos encontrados (final): ${alunos.length}`, alunos);

    return NextResponse.json({
      success: true,
      data: alunos,
      count: alunos.length,
    });
  } catch (error) {
    console.error("[Search API] Erro ao buscar aluno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

