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

    if (!cpf && !nome) {
      return NextResponse.json(
        { error: "Parâmetro 'cpf' ou 'nome' é obrigatório" },
        { status: 400 }
      );
    }

    // Construir filtros básicos (CPF e nome) - sem filtros de relação para evitar erro 500
    // Vamos filtrar por escola e turma no código após buscar os dados
    const filters: string[] = [];

    if (cpf) {
      filters.push(`filters[cpf][$eq]=${encodeURIComponent(cpf)}`);
    }

    // Para busca por nome, vamos buscar todos e filtrar no código para suportar busca por palavras parciais
    // Se for CPF, podemos usar filtro direto
    const filtersString = filters.length > 0 ? filters.join("&") : "";
    const url = `${STRAPI_API_URL}/api/alunos-escola-parceira?${filtersString}&populate=escola&populate=turma&pagination[pageSize]=10000`;

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
    
    const alunosArray = result.data || [];

    // Normalizar estrutura e filtrar por escola/turma no código (já que filtros de relação causam erro 500)
    interface AlunoItem {
      id?: number;
      attributes?: {
        nome?: string;
        cpf?: string;
        escola?: {
          nome?: string;
          data?: {
            attributes?: {
              nome?: string;
            };
          };
        } | string;
        turma?: {
          turma?: string;
          data?: {
            attributes?: {
              turma?: string;
            };
          };
        } | string;
      };
      nome?: string;
      cpf?: string;
      escola?: {
        nome?: string;
      } | string;
      turma?: {
        turma?: string;
      } | string;
    }

    const alunosNormalizados = alunosArray.map((item: AlunoItem) => {
      const itemData = (item.attributes || item) as AlunoItem['attributes'] & AlunoItem;
      
      // Extrair nome da escola (pode ser objeto ou string)
      let escolaNome: string | undefined;
      const escolaData = itemData.escola;
      if (typeof escolaData === 'string') {
        escolaNome = escolaData;
      } else if (escolaData && typeof escolaData === 'object') {
        if ('nome' in escolaData) {
          escolaNome = escolaData.nome;
        }
        if (!escolaNome && 'data' in escolaData && escolaData.data) {
          const dataAttrs = escolaData.data.attributes;
          if (dataAttrs && 'nome' in dataAttrs) {
            escolaNome = dataAttrs.nome;
          }
        }
      }
      if (!escolaNome) {
        const escolaItem = item.escola;
        if (typeof escolaItem === 'string') {
          escolaNome = escolaItem;
        } else if (escolaItem && typeof escolaItem === 'object' && 'nome' in escolaItem) {
          escolaNome = escolaItem.nome;
        }
      }
      
      // Extrair nome da turma (pode ser objeto ou string)
      let turmaNome: string | undefined;
      const turmaData = itemData.turma;
      if (typeof turmaData === 'string') {
        turmaNome = turmaData;
      } else if (turmaData && typeof turmaData === 'object') {
        if ('turma' in turmaData) {
          turmaNome = turmaData.turma;
        }
        if (!turmaNome && 'data' in turmaData && turmaData.data) {
          const dataAttrs = turmaData.data.attributes;
          if (dataAttrs && 'turma' in dataAttrs) {
            turmaNome = dataAttrs.turma;
          }
        }
      }
      if (!turmaNome) {
        const turmaItem = item.turma;
        if (typeof turmaItem === 'string') {
          turmaNome = turmaItem;
        } else if (turmaItem && typeof turmaItem === 'object' && 'turma' in turmaItem) {
          turmaNome = turmaItem.turma;
        }
      }
      
      return {
        id: item.id || itemData.id,
        nome: itemData.nome || item.nome,
        cpf: itemData.cpf || item.cpf,
        escola: escolaNome,
        turma: turmaNome,
      };
    });

    // Interface para aluno normalizado
    interface AlunoNormalizado {
      id?: number;
      nome?: string;
      cpf?: string;
      escola?: string;
      turma?: string;
    }

    // Filtrar por nome no código se fornecido (suporta busca por palavras parciais)
    let alunos: AlunoNormalizado[] = alunosNormalizados;
    
    if (nome) {
      // Dividir o nome de busca em palavras e verificar se todas estão presentes
      const palavrasBusca = nome
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((palavra: string) => palavra.length > 0);

      alunos = alunos.filter((aluno: AlunoNormalizado) => {
        const alunoNome = (aluno.nome || "").toLowerCase();
        // Verificar se todas as palavras da busca estão presentes no nome do aluno
        return palavrasBusca.every((palavra: string) => alunoNome.includes(palavra));
      });
    }

    // Filtrar por escola e turma no código se fornecidos
    
    if (escola) {
      alunos = alunos.filter((aluno: AlunoNormalizado) => {
        const alunoEscola = aluno.escola?.toLowerCase().trim() || "";
        const escolaBusca = escola.toLowerCase().trim();
        return alunoEscola === escolaBusca;
      });
    }

    if (turma) {
      alunos = alunos.filter((aluno: AlunoNormalizado) => {
        const alunoTurma = aluno.turma?.toLowerCase().trim() || "";
        const turmaBusca = turma.toLowerCase().trim();
        return alunoTurma === turmaBusca;
      });
    }

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

