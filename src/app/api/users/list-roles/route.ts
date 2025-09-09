import { NextResponse } from "next/server";

export async function GET() {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL) {
      return NextResponse.json(
        { error: "STRAPI_URL not configured" },
        { status: 500 }
      );
    }

    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "STRAPI_TOKEN not configured" },
        { status: 500 }
      );
    }

    // Get available roles from Strapi
    const response = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error fetching roles:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch roles" },
        { status: response.status }
      );
    }

    const roles = await response.json();
    console.log("Available roles:", roles);

    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error in list-roles API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
