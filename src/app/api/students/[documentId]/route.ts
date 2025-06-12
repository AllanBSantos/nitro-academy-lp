import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos/${params.documentId}?populate=*`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "API response not ok:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch student details");
    }

    const data = await response.json();
    if (!data.data?.attributes) {
      console.error("Invalid API response structure:", data);
      throw new Error("Invalid API response structure");
    }

    // Transform the data to match our StudentDetails interface
    const studentDetails = {
      nome: data.data.attributes.nome || "",
      email: data.data.attributes.email_responsavel || "",
      telefone: data.data.attributes.telefone_responsavel || "",
    };

    return NextResponse.json(studentDetails);
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json(
      { error: "Failed to fetch student details" },
      { status: 500 }
    );
  }
}
