import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 400 }
      );
    }

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Decode JWT to get user ID
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        return NextResponse.json({ error: "Token inválido" }, { status: 400 });
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.id;

      if (!userId) {
        return NextResponse.json(
          { error: "Token não contém ID do usuário" },
          { status: 400 }
        );
      }

      // Get user data using admin token
      const userResponse = await fetch(
        `${STRAPI_URL}/api/users/${userId}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );

      if (!userResponse.ok) {
        return NextResponse.json(
          { error: "Erro ao obter dados do usuário" },
          { status: 500 }
        );
      }

      const userData = await userResponse.json();

      // Get user's role details
      const roleResponse = await fetch(
        `${STRAPI_URL}/api/users-permissions/roles/${userData.role.id}`,
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );

      if (!roleResponse.ok) {
        return NextResponse.json(
          { error: "Erro ao obter informações do role" },
          { status: 500 }
        );
      }

      const roleData = await roleResponse.json();

      // Extract mentor and student IDs from user data
      const mentorId = userData.mentor?.id || null;
      const studentId = userData.student?.id || null;
      return NextResponse.json({
        userId: userData.id,
        role: {
          id: userData.role.id,
          type: userData.role.type,
          name: userData.role.name,
        },
        mentorId,
        studentId,
        permissions: roleData.role.permissions || {},
      });
    } catch (decodeError) {
      console.error("Error decoding JWT:", decodeError);
      return NextResponse.json(
        { error: "Erro ao decodificar token" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verify-role API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
