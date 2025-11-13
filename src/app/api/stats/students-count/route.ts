import { NextResponse } from "next/server";

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

export async function GET() {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Buscar apenas a contagem de alunos (pagination meta)
    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos?pagination[page]=1&pagination[pageSize]=1&publicationState=preview&locale=pt-BR`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        next: { revalidate: 60 }, // Cache por 60 segundos
      }
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`Failed to fetch students count: ${response.status}`);
    }

    const data = await response.json();
    const total = data?.meta?.pagination?.total ?? 0;

    return NextResponse.json(
      { count: typeof total === "number" ? total : 0 },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching students count:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contagem de alunos", count: 0 },
      { status: 500 }
    );
  }
}
