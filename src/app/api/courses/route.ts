import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL = process.env.STRAPI_API_URL || "http://localhost:1337";

export async function GET(request: NextRequest) {
  try {
    // Use searchParams from NextRequest instead of URL constructor
    const locale = request.nextUrl.searchParams.get("locale") || "pt-BR";

    // URL para buscar cursos com cronograma
    const url = `${STRAPI_API_URL}/api/cursos?locale=${locale}&populate=cronograma&fields[0]=id&fields[1]=titulo&sort=createdAt:desc`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Strapi response error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: "Erro ao buscar cursos" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Cursos encontrados:", data.data?.length || 0);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
