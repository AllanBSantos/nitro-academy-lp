import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

// GET - Listar aulas
export async function GET(request: NextRequest) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const cursoId = request.nextUrl.searchParams.get("cursoId");

    const populateParams =
      "fields[0]=id" +
      "&fields[1]=documentId" +
      "&fields[2]=titulo" +
      "&fields[3]=data" +
      "&fields[4]=descricao" +
      "&fields[5]=link_aula" +
      "&fields[6]=aula_status" +
      "&populate[arquivos][fields][0]=id" +
      "&populate[arquivos][fields][1]=name" +
      "&populate[arquivos][fields][2]=url" +
      "&populate[arquivos][fields][3]=mime" +
      "&populate[arquivos][fields][4]=size" +
      "&populate[arquivos][fields][5]=createdAt" +
      "&populate[curso][fields][0]=id" +
      "&populate[curso][fields][1]=titulo" +
      "&populate[alunos][populate][aluno][fields][0]=id" +
      "&populate[alunos][populate][aluno][fields][1]=nome" +
      "&publicationState=preview";

    // Construir URL com filtros
    let url = `${STRAPI_API_URL}/api/aulas?${populateParams}&sort=data:desc`;

    if (cursoId) {
      // Para relação oneToOne no Strapi v4, tentar diferentes sintaxes
      // Opção 1: filtrar diretamente pela relação
      url = `${STRAPI_API_URL}/api/aulas?filters[curso][id][$eq]=${cursoId}&${populateParams}&sort=data:desc`;
    }

    let response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      cache: "no-store",
    });

    // Se o filtro falhar e tiver cursoId, tentar buscar todas e filtrar no código
    if (!response.ok && cursoId) {
      const allUrl = `${STRAPI_API_URL}/api/aulas?${populateParams}&sort=data:desc`;
      response = await fetch(allUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        cache: "no-store",
      });
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[Aulas API] Strapi response error: ${response.status} ${response.statusText}`,
        errorText,
        `URL: ${url}`
      );
      return NextResponse.json(
        { error: "Erro ao buscar aulas", details: errorText },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    
    // Se buscou todas as aulas e tem cursoId, filtrar no código
    if (cursoId && responseData.data && Array.isArray(responseData.data)) {
      responseData.data = responseData.data.filter((aula: { curso?: { id?: number | string } }) => {
        return aula.curso && (aula.curso.id === parseInt(cursoId, 10) || aula.curso.id?.toString() === cursoId);
      });
    }
    
    const data = responseData;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar aulas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar aula
export async function POST(request: NextRequest) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { titulo, data: dataInput, time, descricao, cursoId, link_aula } = body;

    // Validar campos obrigatórios
    if (!titulo || !dataInput || !cursoId) {
      return NextResponse.json(
        { error: "Campos obrigatórios: titulo, data, cursoId" },
        { status: 400 }
      );
    }

    // Combinar data e hora em formato ISO
    let dataCompleta = dataInput;
    if (time) {
      const [hours, minutes] = time.split(":");
      const dateObj = new Date(dataInput);
      dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      dataCompleta = dateObj.toISOString();
    } else {
      // Se não tiver hora, usar apenas a data à meia-noite
      const dateObj = new Date(dataInput);
      dateObj.setHours(0, 0, 0, 0);
      dataCompleta = dateObj.toISOString();
    }

    // Preparar dados para o Strapi
    const strapiData: {
      data: {
        titulo: string;
        data: string;
        curso?: number;
        descricao?: string;
        link_aula?: string;
        aula_status?: string;
      };
    } = {
      data: {
        titulo,
        data: dataCompleta,
        curso: parseInt(cursoId, 10),
        aula_status: "PENDENTE",
      },
    };

    if (descricao) {
      strapiData.data.descricao = descricao;
    }

    if (link_aula) {
      strapiData.data.link_aula = link_aula;
    }

    const response = await fetch(`${STRAPI_API_URL}/api/aulas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(strapiData),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[Aulas API] Strapi POST error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        { error: "Erro ao criar aula" },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aula:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

