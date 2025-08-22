import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, roleId, mentorId, studentId } = body;

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: "Missing required fields: userId and roleId" },
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

    // Prepare update data
    const updateData: any = { role: roleId };
    if (mentorId) updateData.mentor = mentorId;
    if (studentId) updateData.student = studentId;

    // Try to update using the regular users endpoint first
    const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const result = await response.json();

      // Verify the update was successful
      const verifyResponse = await fetch(
        `${STRAPI_URL}/api/users/${userId}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log("User updated successfully:", {
          role: verifyData.role?.type,
          mentorId: verifyData.mentor?.id,
          studentId: verifyData.student?.id,
        });
      }

      return NextResponse.json(result);
    }

    // If regular endpoint failed, try users-permissions as fallback
    const altResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (altResponse.ok) {
      const result = await altResponse.json();
      return NextResponse.json(result);
    }

    // Both approaches failed
    const errorData = await response.json().catch(() => ({}));
    return NextResponse.json(
      {
        error: "Failed to update user role",
        details: errorData,
        status: response.status,
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error in update-role API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
