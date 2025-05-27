import { NextResponse } from "next/server";

const CLASSAPP_API_URL = process.env.NEXT_PUBLIC_CLASSAPP_API_URL;
const CLASSAPP_API_TOKEN = process.env.CLASSAPP_API_TOKEN;

export async function POST(request: Request) {
  try {
    const { studentData: rawStudentData } = await request.json();

    if (!CLASSAPP_API_URL || !CLASSAPP_API_TOKEN) {
      return NextResponse.json(
        { success: false, error: "ClassApp API configuration is missing" },
        { status: 500 }
      );
    }

    const payload = {
      studentData: {
        ...rawStudentData,
        fullname: rawStudentData.nome || rawStudentData.fullname,
        disabled: false,
      },
    };
    const response = await fetch(`${CLASSAPP_API_URL}/v1/student/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLASSAPP_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = "Failed to create/update student in ClassApp";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage =
          errorData.message || errorData.errors?.join(", ") || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student successfully created/updated in ClassApp",
    });
  } catch (error) {
    console.error("Error in ClassApp API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
