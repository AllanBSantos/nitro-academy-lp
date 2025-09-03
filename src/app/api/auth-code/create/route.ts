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

    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    if (cleanWhatsapp.length < 10 || cleanWhatsapp.length > 13) {
      return NextResponse.json(
        { error: "Número de WhatsApp inválido" },
        { status: 400 }
      );
    }

    let formattedWhatsapp = cleanWhatsapp;
    if (cleanWhatsapp.length === 10 || cleanWhatsapp.length === 11) {
      formattedWhatsapp = "55" + cleanWhatsapp;
    } else if (cleanWhatsapp.length === 12 || cleanWhatsapp.length === 13) {
      formattedWhatsapp = cleanWhatsapp;
    }

    if (formattedWhatsapp.length !== 13) {
      return NextResponse.json(
        { error: "Número de WhatsApp inválido" },
        { status: 400 }
      );
    }

    const ZAZU_URL = process.env.NEXT_PUBLIC_ZAZU_API_URL;

    if (!ZAZU_URL) {
      return NextResponse.json(
        { error: "ZAZU_URL não configurado" },
        { status: 500 }
      );
    }

    const requestBody = {
      whatsappNumber: formattedWhatsapp,
    };

    const response = await fetch(`${ZAZU_URL}/auth-code/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.error || "Erro ao criar código de autenticação",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Código enviado com sucesso",
      data: data,
    });
  } catch (error) {
    console.error("Error creating auth code:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
