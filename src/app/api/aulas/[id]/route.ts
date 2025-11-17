import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

const POPULATE_PARAMS =
  "fields[0]=id" +
  "&fields[1]=documentId" +
  "&fields[2]=titulo" +
  "&fields[3]=data" +
  "&fields[4]=descricao" +
  "&fields[5]=anotacoes" +
  "&fields[6]=link_aula" +
  "&fields[7]=aula_status" +
  "&populate[curso][fields][0]=id" +
  "&populate[curso][fields][1]=titulo" +
  "&populate[alunos][populate][aluno][fields][0]=id" +
  "&populate[alunos][populate][aluno][fields][1]=nome" +
  "&populate[arquivos][fields][0]=id" +
  "&populate[arquivos][fields][1]=name" +
  "&populate[arquivos][fields][2]=url" +
  "&populate[arquivos][fields][3]=mime" +
  "&populate[arquivos][fields][4]=size" +
  "&populate[arquivos][fields][5]=createdAt";

const PREVIEW_PARAM = "&publicationState=preview";

async function resolveAulaIdentifiers(aulaId: string) {
  const sanitized = aulaId.toString().replace(/\/+$/, "");
  const filters: string[] = [];
  if (/^\d+$/.test(sanitized)) {
    filters.push(`filters[id][$eq]=${encodeURIComponent(sanitized)}`);
  }
  filters.push(`filters[documentId][$eq]=${encodeURIComponent(sanitized)}`);

  for (const filter of filters) {
    const url = `${STRAPI_API_URL}/api/aulas?${filter}&fields[0]=id&fields[1]=documentId&pagination[pageSize]=1&publicationState=preview`;
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(
          `[Aulas API] Identifier lookup error (${filter}): ${response.status} ${response.statusText} ${errorText}`
        );
        continue;
      }

      const data = await response.json();
      const entry = Array.isArray(data?.data) ? data.data[0] : data.data;
      if (entry) {
        return {
          numericId: entry.id ? entry.id.toString() : null,
          documentId: entry.documentId || null,
        };
      }
    } catch (error) {
      console.error("[Aulas API] Identifier lookup exception:", error);
    }
  }

  return { numericId: null, documentId: null };
}

async function fetchAulaEntry(aulaId: string) {
  const sanitized = aulaId.toString().replace(/\/+$/, "");

  const queryUrl = `${STRAPI_API_URL}/api/aulas?filters[$or][0][id][$eq]=${encodeURIComponent(
    sanitized
  )}&filters[$or][1][documentId][$eq]=${encodeURIComponent(
    sanitized
  )}&pagination[pageSize]=1&${POPULATE_PARAMS}${PREVIEW_PARAM}`;

  const response = await fetch(queryUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    cache: "no-store",
  });

  if (response.ok) {
    const data = await response.json();
    const entry = Array.isArray(data?.data) ? data.data[0] : null;
    return entry || null;
  }

  const errorText = await response.text().catch(() => "");
  throw new Error(
    `[Aulas API] Lookup falhou: ${response.status} ${response.statusText} ${errorText}`
  );
}

// GET - Buscar aula específica com todos os dados
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const aulaEntry = await fetchAulaEntry(params.id);

    if (!aulaEntry) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: aulaEntry });
  } catch (error) {
    console.error("Erro ao buscar aula:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar aula
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const aulaId = (params.id || "").toString().replace(/\/+$/, "");
    const body = await request.json();
    const { anotacoes, alunos } = body;

    const strapiData: {
      data: {
        anotacoes?: string;
        alunos?: Array<{
          aluno: number;
          comentario?: string;
          spinners_aula?: number;
        }>;
      };
    } = { data: {} };

    if (anotacoes !== undefined) {
      strapiData.data.anotacoes = anotacoes;
    }

    if (alunos && Array.isArray(alunos)) {
      const alunosArray = alunos as Array<{
        aluno: number;
        comentario?: string;
        spinners_aula?: number;
      }>;
      strapiData.data.alunos = alunosArray.map((item) => ({
        aluno: item.aluno,
        comentario: item.comentario || "",
        spinners_aula: item.spinners_aula ?? 0,
      }));
    }

    const targetAula = await fetchAulaEntry(aulaId);

    if (!targetAula) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    const identifiers = await resolveAulaIdentifiers(aulaId);
    const candidateIds = Array.from(
      new Set(
        [
          targetAula.documentId,
          identifiers.documentId,
          targetAula.id?.toString(),
          identifiers.numericId,
          aulaId,
        ].filter(Boolean)
      )
    );

    let response: Response | null = null;
    let lastErrorText = "";

    for (const candidate of candidateIds) {
      response = await fetch(`${STRAPI_API_URL}/api/aulas/${candidate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(strapiData),
      });

      if (response.ok) {
        break;
      }

      lastErrorText = await response.text().catch(() => "");

      if (response.status !== 404) {
        console.error(
          `[Aulas API] Strapi PUT error (${candidate}): ${response.status} ${response.statusText}`,
          lastErrorText
        );
        return NextResponse.json(
          { error: "Erro ao atualizar aula" },
          { status: response.status }
        );
      }
    }

    if (!response || !response.ok) {
      console.error(
        "[Aulas API] Nenhum identificador funcionou para atualizar a aula",
        lastErrorText
      );
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[Aulas API] Strapi PUT error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        { error: "Erro ao atualizar aula" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao atualizar aula:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
