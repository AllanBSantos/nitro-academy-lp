import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
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

    // Authenticate with Strapi
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.error?.message || "Credenciais inválidas",
        },
        { status: 401 }
      );
    }

    const data = await response.json();

    if (!data.jwt) {
      return NextResponse.json(
        {
          success: false,
          message: "Token não recebido",
        },
        { status: 500 }
      );
    }

    // Get user data to determine role
    const userResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${data.jwt}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao obter dados do usuário",
        },
        { status: 500 }
      );
    }

    const userData = await userResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        token: data.jwt,
        user: userData,
      },
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
