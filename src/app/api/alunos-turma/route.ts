import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const escola = searchParams.get("escola");
    const turma = searchParams.get("turma");
    const search = searchParams.get("search");

    if (!escola || !turma) {
      return NextResponse.json(
        { error: "Parâmetros 'escola' e 'turma' são obrigatórios" },
        { status: 400 }
      );
    }

    // Construir filtros
    let filters = `filters[escola][nome][$eq]=${encodeURIComponent(
      escola
    )}&filters[turma][turma][$eq]=${encodeURIComponent(turma)}`;

    // Adicionar filtro de busca se fornecido
    if (search && search.length >= 2) {
      filters += `&filters[nome][$containsi]=${encodeURIComponent(search)}`;
    }

    // Buscar alunos da escola e turma específicas
    const url = `${STRAPI_API_URL}/api/alunos-escola-parceira?${filters}&populate=escola&populate=turma&fields[0]=nome&sort=nome:asc`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar alunos" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alunos = result.data.map((item: any) => ({
      nome: item.nome,
      escola: item.escola?.nome || item.escola,
      turma: item.turma?.turma || item.turma,
    }));

    return NextResponse.json({
      success: true,
      data: alunos,
      count: alunos.length,
    });
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
