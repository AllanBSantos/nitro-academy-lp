import { NextRequest, NextResponse } from "next/server";
import { COURSE_QUERY_PARAMS } from "@/lib/strapiCourseQuery";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Sempre usar pt-BR hardcoded (não importa o que vier no parâmetro)
    const locale = "pt-BR";

    // URL para buscar cursos com todos os dados necessários
    // IMPORTANTE: Mantém filtro habilitado=true conforme solicitado
    const url = `${STRAPI_API_URL}/api/cursos?filters[habilitado][$eq]=true&locale=${locale}&${COURSE_QUERY_PARAMS}&sort=createdAt:desc`;

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
        `[Courses API] Strapi response error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        { error: "Erro ao buscar cursos" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
