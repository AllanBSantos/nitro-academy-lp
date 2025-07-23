import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const escola = searchParams.get("escola");
    const page = searchParams.get("page") || "1";

    let url = `${STRAPI_API_URL}/api/alunos-escola-parceira?sort=nome:asc&pagination[pageSize]=100&pagination[page]=${page}`;

    if (escola) {
      url += `&filters[escola][$eq]=${encodeURIComponent(escola)}`;
    }

    console.log("Buscando alunos em:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });


    if (!response.ok) {
      const errorResult = await response.json();
      console.log("Erro ao buscar alunos:", errorResult);
      return NextResponse.json(
        { error: "Erro ao buscar alunos" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
