import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export async function GET(request: NextRequest) {
  try {
    const locale = request.nextUrl.searchParams.get("locale") || "pt-BR";

    const url = `${STRAPI_API_URL}/api/campanhas?fields[0]=id&fields[1]=nome&fields[2]=createdAt&sort=createdAt:desc&locale=${locale}&publicationState=preview`;

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
        { error: "Erro ao buscar campanhas" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Campanhas encontradas:", data.data?.length || 0);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
