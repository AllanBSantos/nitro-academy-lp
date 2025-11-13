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

    const response = await fetch(
      `${STRAPI_API_URL}/api/mentores?pagination[page]=1&pagination[pageSize]=1&publicationState=preview&locale=pt-BR`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.error(
        "Strapi response error in mentors-count:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: "Failed to fetch mentors count from Strapi" },
        { status: response.status }
      );
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
    console.error("Error fetching mentors count:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contagem de mentores", count: 0 },
      { status: 500 }
    );
  }
}

