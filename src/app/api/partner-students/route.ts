import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const escolas = searchParams.getAll("escola");
    const turmas = searchParams.getAll("turma");
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "100";

    let url = `${STRAPI_API_URL}/api/alunos-escola-parceira?sort=nome:asc&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;

    // Add school filters
    if (escolas.length > 0) {
      if (escolas.length === 1) {
        url += `&filters[escola][$eq]=${encodeURIComponent(escolas[0])}`;
      } else {
        escolas.forEach((escola, index) => {
          url += `&filters[escola][$in][${index}]=${encodeURIComponent(
            escola
          )}`;
        });
      }
    }

    // Add class filters
    if (turmas.length > 0) {
      if (turmas.length === 1) {
        url += `&filters[turma][$eq]=${encodeURIComponent(turmas[0])}`;
      } else {
        turmas.forEach((turma, index) => {
          url += `&filters[turma][$in][${index}]=${encodeURIComponent(turma)}`;
        });
      }
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
