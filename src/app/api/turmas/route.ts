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

    if (!escola) {
      return NextResponse.json(
        { error: "Parâmetro 'escola' é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar turmas da escola específica
    const url = `${STRAPI_API_URL}/api/turmas?filters[escola][nome][$eq]=${encodeURIComponent(
      escola
    )}&populate=escola&sort=turma:asc`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar turmas" },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Extrair turmas da resposta
    const turmas = result.data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.turma)
      .filter(Boolean)
      .sort();

    return NextResponse.json({
      success: true,
      data: turmas,
      count: turmas.length,
    });
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
