import { NextRequest, NextResponse } from "next/server";

const STRAPI_UPLOAD_URL = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Arquivo não enviado." },
        { status: 400 }
      );
    }

    if (!process.env.STRAPI_TOKEN || !process.env.NEXT_PUBLIC_STRAPI_API_URL) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta." },
        { status: 500 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("files", file, file.name);

    const strapiResponse = await fetch(STRAPI_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      body: uploadData,
    });

    if (!strapiResponse.ok) {
      const errorPayload = await strapiResponse.json().catch(() => null);
      console.error("Strapi upload error:", errorPayload);
      return NextResponse.json(
        { error: "Falha ao enviar imagem para o Strapi." },
        { status: 500 }
      );
    }

    const responseData = await strapiResponse.json();
    const uploadedFile = Array.isArray(responseData)
      ? responseData[0]
      : responseData?.[0] || responseData;

    return NextResponse.json({
      id: uploadedFile?.id,
      url: uploadedFile?.url || uploadedFile?.formats?.thumbnail?.url || "",
    });
  } catch (error) {
    console.error("Mentor image upload error:", error);
    return NextResponse.json(
      { error: "Erro ao enviar imagem." },
      { status: 500 }
    );
  }
}

