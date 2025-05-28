import { NextResponse } from "next/server";

interface OnboardingRequest {
  studentName: string;
  guardianName: string;
  studentPhone: string;
  guardianPhone: string;
  studentCPF: string;
}

export async function POST(request: Request) {
  try {
    const data: OnboardingRequest = await request.json();

    const ZAZU_API_URL = process.env.ZAZU_API_URL?.replace(/\/$/, ""); 
    const ZAZU_API_TOKEN = process.env.ZAZU_API_TOKEN;

    if (!ZAZU_API_URL || !ZAZU_API_TOKEN) {
      console.error("Missing environment variables");
      return NextResponse.json(
        { success: false, error: "Zazu API configuration is missing" },
        { status: 500 }
      );
    }

    const url = `${ZAZU_API_URL}/onboarding/start`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ZAZU_API_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || "Failed to start onboarding";
      } catch {
        errorMessage = "Failed to start onboarding - Invalid response format";
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in Zazu onboarding:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to start onboarding",
      },
      { status: 500 }
    );
  }
}
