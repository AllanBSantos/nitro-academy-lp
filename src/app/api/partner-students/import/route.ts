import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Dados CSV inválidos" },
        { status: 400 }
      );
    }

    const validatedData = [];
    const errors = [];
    const importedStudents = [];

    for (const row of data) {
      if (!row.nome || !row.escola) {
        errors.push(
          `Linha inválida: ${JSON.stringify(
            row
          )} - Nome e Escola são obrigatórios`
        );
        continue;
      }

      let cpf = "";
      if (row.cpf && row.cpf.trim()) {
        cpf = row.cpf.replace(/\D/g, "");
      }

      validatedData.push({
        nome: row.nome.trim(),
        cpf: cpf,
        escola: row.escola.trim(),
        turma: row.turma ? row.turma.trim() : "",
      });
    }

    if (validatedData.length === 0) {
      return NextResponse.json(
        {
          error: "Nenhum dado válido encontrado",
          details: errors,
        },
        { status: 400 }
      );
    }

    for (const studentData of validatedData) {
      try {
        const strapiUrl = `${STRAPI_API_URL}/api/alunos-escola-parceira`;

        const response = await fetch(strapiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: studentData }),
        });

        if (response.ok) {
          const result = await response.json();
          importedStudents.push(result.data);
        } else {
          const errorResult = await response.json();
          errors.push(
            `Erro ao importar ${studentData.nome}: ${
              errorResult.error?.message || "Erro desconhecido"
            }`
          );
        }
      } catch (error) {
        console.error("Erro ao importar aluno:", error);
        errors.push(`Erro ao importar ${studentData.nome}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedStudents.length,
      errors: errors,
      message: `Importação concluída. ${importedStudents.length} alunos importados com sucesso.`,
    });
  } catch (error) {
    console.error("Erro detalhado:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
