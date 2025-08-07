import { NextResponse } from "next/server";
import { generateStudentsReport } from "@/lib/strapi";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const reportData = await generateStudentsReport();

    return NextResponse.json(
      {
        success: true,
        data: reportData,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
