import { NextResponse } from "next/server";

export async function GET() {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Fetch admin emails from Strapi Admin collection
    const response = await fetch(`${STRAPI_URL}/api/admins?populate=*`, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar admins" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract admin emails from the response - using the actual Strapi structure
    const adminEmails: string[] = [];

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((admin: { email?: string }) => {
        if (admin.email) {
          adminEmails.push(admin.email);
        }
      });
    }

    return NextResponse.json({ adminEmails });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
