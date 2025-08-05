import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const BATCH_SIZE = 5;
const BATCH_DELAY = 2000;
const REQUEST_TIMEOUT = 15000;
const MAX_RETRIES = 3;
const MAX_STUDENTS_PER_REQUEST = 50; // Limite para evitar timeout do servidor

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function processStudentWithRetry(
  studentData: {
    nome: string;
    cpf: string;
    escola: string;
    turma: string;
  },
  retryCount = 0
): Promise<{ success: boolean; error?: string }> {
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
      cache: "no-store", // Disable fetch caching
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      await response.json();
      return { success: true };
    } else {
      let errorMessage = `Erro ${response.status}`;
      try {
        const errorResult = await response.json();
        errorMessage = errorResult.error?.message || errorMessage;
      } catch {
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }

      if (
        (response.status === 504 || response.status === 408) &&
        retryCount < MAX_RETRIES
      ) {
        await delay(1000 * (retryCount + 1));
        return processStudentWithRetry(studentData, retryCount + 1);
      }

      return { success: false, error: errorMessage };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      (errorMessage.includes("timeout") || errorMessage.includes("aborted")) &&
      retryCount < MAX_RETRIES
    ) {
      await delay(1000 * (retryCount + 1));
      return processStudentWithRetry(studentData, retryCount + 1);
    }

    return { success: false, error: errorMessage };
  }
}

async function processBatch(
  students: Array<{
    nome: string;
    cpf: string;
    escola: string;
    turma: string;
  }>
) {
  const results = await Promise.allSettled(
    students.map((student) => processStudentWithRetry(student))
  );

  let imported = 0;
  const errors: string[] = [];

  results.forEach((result, index) => {
    const student = students[index];

    if (result.status === "fulfilled" && result.value.success) {
      imported++;
    } else {
      const error =
        result.status === "rejected"
          ? result.reason
          : result.value.error || "Erro desconhecido";
      errors.push(`Erro ao importar ${student.nome}: ${error}`);
    }
  });

  return { imported, errors };
}

export async function POST(request: NextRequest) {
  try {
    const { data, offset = 0 } = await request.json();

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Dados CSV inválidos" },
        { status: 400 }
      );
    }

    const validatedData = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      if (!row.nome || !row.escola) {
        const errorMsg = `Linha ${i + 1} inválida: ${JSON.stringify(
          row
        )} - Nome e Escola são obrigatórios`;
        errors.push(errorMsg);
        continue;
      }

      let cpf = "";
      if (row.cpf && row.cpf.trim()) {
        cpf = row.cpf.replace(/\D/g, "");
      }

      const validatedRow = {
        nome: row.nome.trim(),
        cpf: cpf,
        escola: row.escola.trim(),
        turma: row.turma ? row.turma.trim() : "",
      };

      validatedData.push(validatedRow);
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

    // Remove duplicatas
    const uniqueData = [];
    const seen = new Set();

    for (const student of validatedData) {
      const key = `${student.nome.toLowerCase()}-${student.escola.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(student);
      }
    }

    if (uniqueData.length !== validatedData.length) {
      const duplicates = validatedData.length - uniqueData.length;
      errors.push(
        `${duplicates} registros duplicados foram removidos automaticamente`
      );
    }

    // Processa apenas uma parte dos dados para evitar timeout
    const startIndex = offset;
    const endIndex = Math.min(
      startIndex + MAX_STUDENTS_PER_REQUEST,
      uniqueData.length
    );
    const dataToProcess = uniqueData.slice(startIndex, endIndex);

    const batches = [];
    for (let i = 0; i < dataToProcess.length; i += BATCH_SIZE) {
      batches.push(dataToProcess.slice(i, i + BATCH_SIZE));
    }

    let totalImported = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      const batchResults = await processBatch(batch);

      totalImported += batchResults.imported;
      errors.push(...batchResults.errors);

      if (i < batches.length - 1) {
        await delay(BATCH_DELAY);
      }
    }

    const hasMore = endIndex < uniqueData.length;
    const nextOffset = hasMore ? endIndex : null;

    const responseData = NextResponse.json({
      success: true,
      imported: totalImported,
      errors: errors,
      hasMore: hasMore,
      nextOffset: nextOffset,
      totalProcessed: endIndex,
      totalStudents: uniqueData.length,
      message: hasMore
        ? `Importação parcial: ${totalImported} alunos importados. Continuando...`
        : `Importação concluída. ${totalImported} alunos importados com sucesso.`,
      details: {
        totalProcessed: uniqueData.length,
        batchesProcessed: batches.length,
        batchSize: BATCH_SIZE,
        progress: Math.round((endIndex / uniqueData.length) * 100),
        duplicatesRemoved: validatedData.length - uniqueData.length,
      },
    });

    // Add cache control headers
    responseData.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    responseData.headers.set("Pragma", "no-cache");
    responseData.headers.set("Expires", "0");

    return responseData;
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
