import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos-escola-parceira?pagination[pageSize]=10000&sort=nome:asc`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Erro ao buscar alunos:", response.statusText);
      return NextResponse.json(
        { error: "Erro ao buscar alunos" },
        { status: response.status }
      );
    }

    const result = await response.json();
    const students = result.data || [];

    const normalizeString = (str: string) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    };

    const searchName = normalizeString(name);
    const matchingStudents = students.filter((student: any) => {
      const studentName = normalizeString(
        student.nome || student.attributes?.nome || ""
      );
      const matches = studentName.includes(searchName);

      return matches;
    });

    const normalizedStudents = matchingStudents.map((student: any) => ({
      id: student.id,
      nome: student.nome || student.attributes?.nome,
      cpf: student.cpf || student.attributes?.cpf,
      escola: student.escola || student.attributes?.escola,
      turma: student.turma || student.attributes?.turma,
    }));

    return NextResponse.json({
      success: true,
      count: matchingStudents.length,
      data: normalizedStudents,
    });
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
