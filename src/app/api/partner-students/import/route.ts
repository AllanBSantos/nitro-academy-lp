import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const BATCH_SIZE = 10;
const BATCH_DELAY = 1000;
const REQUEST_TIMEOUT = 30000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function processBatch(
  students: Array<{
    nome: string;
    cpf: string;
    escola: string;
    turma: string;
  }>
) {
  const batchResults = {
    imported: 0,
    errors: [] as string[],
  };

  for (const studentData of students) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const strapiUrl = `${STRAPI_API_URL}/api/alunos-escola-parceira`;

      const response = await fetch(strapiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: studentData }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        await response.json();
        batchResults.imported++;
      } else {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error?.message || errorMessage;
        } catch {
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }

        batchResults.errors.push(
          `Erro ao importar ${studentData.nome}: ${errorMessage}`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      batchResults.errors.push(
        `Erro ao importar ${studentData.nome}: ${errorMessage}`
      );
    }
  }

  return batchResults;
}

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
    let totalImported = 0;

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

    const batches = [];
    for (let i = 0; i < validatedData.length; i += BATCH_SIZE) {
      batches.push(validatedData.slice(i, i + BATCH_SIZE));
    }

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      const batchResults = await processBatch(batch);
      totalImported += batchResults.imported;
      errors.push(...batchResults.errors);

      if (i < batches.length - 1) {
        await delay(BATCH_DELAY);
      }
    }

    return NextResponse.json({
      success: true,
      imported: totalImported,
      errors: errors,
      message: `Importação concluída. ${totalImported} alunos importados com sucesso.`,
      details: {
        totalProcessed: validatedData.length,
        batchesProcessed: batches.length,
        batchSize: BATCH_SIZE,
        progress: 100,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
