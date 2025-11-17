import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.STRAPI_TOKEN || "";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    if (!STRAPI_API_URL) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Construir o caminho do arquivo
    const filePath = params.path.join("/");
    const strapiUrl = `${STRAPI_API_URL}/${filePath}`;

    // Buscar o arquivo do Strapi
    const response = await fetch(strapiUrl, {
      headers: ADMIN_TOKEN
        ? {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          }
        : {},
    });

    if (!response.ok) {
      console.error(
        `[Files Proxy] Erro ao buscar arquivo: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: response.status }
      );
    }

    // Obter o conteúdo do arquivo
    const fileBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    // Retornar o arquivo com os headers apropriados
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filePath.split("/").pop()}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[Files Proxy] Erro ao processar arquivo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

