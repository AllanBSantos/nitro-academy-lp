import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    console.log("Test endpoint - Environment check:", {
      STRAPI_URL: STRAPI_URL ? "SET" : "NOT SET",
      ADMIN_TOKEN: ADMIN_TOKEN ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    });

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: {
            STRAPI_URL: !!STRAPI_URL,
            ADMIN_TOKEN: !!ADMIN_TOKEN,
            NODE_ENV: process.env.NODE_ENV,
          },
        },
        { status: 500 }
      );
    }

    // Test basic connectivity
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/cursos?pagination[limit]=1`,
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );

      return NextResponse.json({
        success: true,
        strapiStatus: response.status,
        strapiOk: response.ok,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          STRAPI_URL_SET: !!STRAPI_URL,
          ADMIN_TOKEN_SET: !!ADMIN_TOKEN,
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            STRAPI_URL_SET: !!STRAPI_URL,
            ADMIN_TOKEN_SET: !!ADMIN_TOKEN,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
