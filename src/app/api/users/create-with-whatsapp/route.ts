import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { whatsapp } = await request.json();

    if (!whatsapp) {
      return NextResponse.json(
        { error: "Número de WhatsApp é obrigatório" },
        { status: 400 }
      );
    }

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

    if (!STRAPI_URL) {
      return NextResponse.json(
        { error: "STRAPI_URL não configurado" },
        { status: 500 }
      );
    }

    // Create user in Strapi
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: `user_${whatsapp}`,
        email: `${whatsapp}@whatsapp.user`,
        password: `whatsapp_${whatsapp}_${Date.now()}`, // Generate a unique password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.error?.message || "Erro ao criar usuário",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      token: data.jwt,
      user: data.user,
    });
  } catch (error) {
    console.error("Error creating user with WhatsApp:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
