import { NextRequest, NextResponse } from "next/server";

interface ParticipationData {
  lessonId: number;
  action: string;
  timestamp: string;
  studentId?: number;
  studentName?: string;
  googleEmail?: string;
  googleDisplayName?: string;
  googlePhotoURL?: string;
  googleId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ParticipationData = await request.json();

    if (!body.lessonId || !body.action || !body.timestamp) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    const participationRecord = {
      id: Date.now(),
      lessonId: body.lessonId,
      action: body.action,
      timestamp: body.timestamp,
      studentId: body.studentId || null,
      studentName: body.studentName || null,
      googleEmail: body.googleEmail || null,
      googleDisplayName: body.googleDisplayName || null,
      googlePhotoURL: body.googlePhotoURL || null,
      googleId: body.googleId || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Participação registrada com sucesso",
      data: participationRecord,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "ID da aula não fornecido" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      participations: [],
      message: "Endpoint não implementado ainda",
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
