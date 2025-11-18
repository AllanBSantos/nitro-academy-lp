import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

interface StrapiFile {
  id: number;
  name?: string;
  url?: string;
  mime?: string;
  size?: number;
  createdAt?: string;
  attributes?: {
    id?: number;
    name?: string;
    url?: string;
    mime?: string;
    size?: number;
    createdAt?: string;
  };
}

interface StrapiUploadResponse {
  id: number;
  [key: string]: unknown;
}

interface StrapiAulaEntry {
  id?: number;
  documentId?: string;
  arquivos?: {
    data?: StrapiFile[];
  } | StrapiFile[];
  attributes?: {
    arquivos?: {
      data?: StrapiFile[];
    };
  };
}

async function resolveAulaIdentifiers(aulaId: string) {
  const sanitized = aulaId.toString().replace(/\/+$/, "");
  const filters: string[] = [];
  if (/^\d+$/.test(sanitized)) {
    filters.push(`filters[id][$eq]=${encodeURIComponent(sanitized)}`);
  }
  filters.push(`filters[documentId][$eq]=${encodeURIComponent(sanitized)}`);

  for (const filter of filters) {
    const url = `${STRAPI_API_URL}/api/aulas?${filter}&fields[0]=id&fields[1]=documentId&pagination[pageSize]=1&publicationState=preview`;
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(
          `[Aulas Files API] Lookup error (${filter}): ${response.status} ${response.statusText} ${errorText}`
        );
        continue;
      }

      const data = await response.json();
      const entry = Array.isArray(data?.data) ? data.data[0] : null;
      if (entry?.id) {
        return {
          numericId: entry.id ? entry.id.toString() : null,
          documentId: entry.documentId || sanitized,
        };
      }
    } catch (error) {
      console.error("[Aulas Files API] Lookup exception:", error);
    }
  }

  return { numericId: null, documentId: null };
}

// POST - Upload de arquivo para aula
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const resolved = await resolveAulaIdentifiers(params.id);
    if (!resolved.documentId && !resolved.numericId) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    const aulaTargetId =
      resolved.documentId || resolved.numericId || params.id;
    const formData = await request.formData();
    
    // Aceitar múltiplos arquivos (file ou files[])
    const files: File[] = [];
    const fileInput = formData.get("file") as File | null;
    const filesInput = formData.getAll("files[]") as File[];
    
    if (fileInput) {
      files.push(fileInput);
    }
    if (filesInput.length > 0) {
      files.push(...filesInput);
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo fornecido" },
        { status: 400 }
      );
    }

    // 1. Upload de todos os arquivos para o Strapi de uma vez
    const uploadFormData = new FormData();
    files.forEach((file) => {
      uploadFormData.append("files", file);
    });

    const uploadResponse = await fetch(`${STRAPI_API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text().catch(() => "");
      console.error(
        `[Aulas API] Upload error: ${uploadResponse.status} ${uploadResponse.statusText}`,
        errorText
      );
      return NextResponse.json(
        { error: "Erro ao fazer upload do arquivo" },
        { status: uploadResponse.status }
      );
    }

    const uploadData = await uploadResponse.json() as StrapiUploadResponse | StrapiUploadResponse[];
    const uploadedFiles = Array.isArray(uploadData) ? uploadData : [uploadData];
    const fileIds = uploadedFiles
      .map((file: StrapiUploadResponse) => file.id)
      .filter((id: number | undefined): id is number => id != null);

    if (fileIds.length === 0) {
      return NextResponse.json(
        { error: "Erro ao obter IDs dos arquivos" },
        { status: 500 }
      );
    }

    const filterParam = resolved.documentId
      ? `filters[documentId][$eq]=${encodeURIComponent(resolved.documentId)}`
      : `filters[id][$eq]=${encodeURIComponent(resolved.numericId || aulaTargetId)}`;

    // 2. Buscar aula atual para obter arquivos existentes
    // Popular todos os campos necessários dos arquivos
    const populateParams = 
      "&populate[arquivos][fields][0]=id" +
      "&populate[arquivos][fields][1]=name" +
      "&populate[arquivos][fields][2]=url" +
      "&populate[arquivos][fields][3]=mime" +
      "&populate[arquivos][fields][4]=size" +
      "&populate[arquivos][fields][5]=createdAt";
    
    const aulaResponse = await fetch(
      `${STRAPI_API_URL}/api/aulas?${filterParam}${populateParams}&publicationState=preview`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (!aulaResponse.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar aula" },
        { status: aulaResponse.status }
      );
    }

    const aulaData = await aulaResponse.json();
    const aulaEntry = Array.isArray(aulaData?.data)
      ? aulaData.data[0]
      : aulaData.data;

    if (!aulaEntry) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Buscar arquivos existentes - garantir que estamos pegando todos
    let arquivosIdsExistentes: number[] = [];
    
    // Tentar diferentes estruturas de resposta do Strapi
    const aulaEntryTypedPost = aulaEntry as StrapiAulaEntry;
    if (aulaEntryTypedPost.arquivos && 'data' in aulaEntryTypedPost.arquivos && Array.isArray(aulaEntryTypedPost.arquivos.data)) {
      arquivosIdsExistentes = aulaEntryTypedPost.arquivos.data.map((arq: StrapiFile) => arq.id).filter((id: number | undefined): id is number => id != null);
    } else if (Array.isArray(aulaEntryTypedPost.arquivos)) {
      arquivosIdsExistentes = aulaEntryTypedPost.arquivos.map((arq: StrapiFile) => arq.id).filter((id: number | undefined): id is number => id != null);
    } else if (aulaEntryTypedPost.attributes?.arquivos?.data && Array.isArray(aulaEntryTypedPost.attributes.arquivos.data)) {
      arquivosIdsExistentes = aulaEntryTypedPost.attributes.arquivos.data.map((arq: StrapiFile) => arq.id).filter((id: number | undefined): id is number => id != null);
    }
    
    // Combinar IDs existentes com novos, evitando duplicatas
    const arquivosIds = Array.from(new Set([...arquivosIdsExistentes, ...fileIds]));

    // 3. Atualizar aula com todos os arquivos
    // Usar a mesma estratégia do endpoint principal - tentar múltiplos identificadores
    const candidateIds = Array.from(
      new Set(
        [
          resolved.documentId,
          resolved.numericId,
          aulaTargetId,
        ].filter(Boolean)
      )
    );
    
    let updateResponse: Response | null = null;
    let lastErrorText = "";
    
    const updatePayload = {
      data: {
        arquivos: arquivosIds,
      },
    };
    
    for (const candidate of candidateIds) {
      updateResponse = await fetch(`${STRAPI_API_URL}/api/aulas/${candidate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (updateResponse.ok) {
        break;
      }

      lastErrorText = await updateResponse.text().catch(() => "");
      console.error(
        `[Aulas Files API] Update error (${candidate}): ${updateResponse.status} ${updateResponse.statusText}`,
        lastErrorText
      );
      
      if (updateResponse.status !== 404) {
        return NextResponse.json(
          { error: "Erro ao associar arquivos à aula" },
          { status: updateResponse.status }
        );
      }
    }

    if (!updateResponse || !updateResponse.ok) {
      console.error(
        "[Aulas Files API] Nenhum identificador funcionou para atualizar a aula",
        lastErrorText
      );
      return NextResponse.json(
        { error: "Erro ao associar arquivos à aula" },
        { status: 404 }
      );
    }

    // Buscar aula atualizada com todos os dados
    const updatedAulaResponse = await fetch(
      `${STRAPI_API_URL}/api/aulas?${filterParam}&populate[arquivos][fields][0]=id&populate[arquivos][fields][1]=name&populate[arquivos][fields][2]=url&populate[arquivos][fields][3]=mime&populate[arquivos][fields][4]=size&populate[arquivos][fields][5]=createdAt&publicationState=preview`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (!updatedAulaResponse.ok) {
      const updateData = await updateResponse.json();
      return NextResponse.json(updateData, { status: 201 });
    }

    const updatedAulaData = await updatedAulaResponse.json();
    const updatedEntry = Array.isArray(updatedAulaData?.data)
      ? updatedAulaData.data[0]
      : updatedAulaData.data;

    if (!updatedEntry) {
      return NextResponse.json(
        { error: "Aula não encontrada após atualização" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedEntry }, { status: 201 });
  } catch (error) {
    console.error("Erro ao fazer upload de arquivo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Remover arquivo da aula
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const resolved = await resolveAulaIdentifiers(params.id);
    if (!resolved.documentId && !resolved.numericId) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    const aulaTargetId =
      resolved.documentId || resolved.numericId || params.id;
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { error: "ID do arquivo não fornecido" },
        { status: 400 }
      );
    }

    // Buscar aula atual
    const filterParam = resolved.documentId
      ? `filters[documentId][$eq]=${encodeURIComponent(resolved.documentId)}`
      : `filters[id][$eq]=${encodeURIComponent(resolved.numericId || aulaTargetId)}`;

    // Popular todos os campos necessários dos arquivos
    const populateParams = 
      "&populate[arquivos][fields][0]=id" +
      "&populate[arquivos][fields][1]=name" +
      "&populate[arquivos][fields][2]=url" +
      "&populate[arquivos][fields][3]=mime" +
      "&populate[arquivos][fields][4]=size" +
      "&populate[arquivos][fields][5]=createdAt";

    const aulaResponse = await fetch(
      `${STRAPI_API_URL}/api/aulas?${filterParam}${populateParams}&publicationState=preview`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (!aulaResponse.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar aula" },
        { status: aulaResponse.status }
      );
    }

    const aulaData = await aulaResponse.json();
    const aulaEntry = Array.isArray(aulaData?.data)
      ? aulaData.data[0]
      : aulaData.data;

    if (!aulaEntry) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Buscar arquivos existentes - garantir que estamos pegando todos
    let arquivosIdsExistentes: number[] = [];
    
    // Tentar diferentes estruturas de resposta do Strapi
    const aulaEntryTypedDelete = aulaEntry as StrapiAulaEntry;
    if (aulaEntryTypedDelete.arquivos && 'data' in aulaEntryTypedDelete.arquivos && Array.isArray(aulaEntryTypedDelete.arquivos.data)) {
      arquivosIdsExistentes = aulaEntryTypedDelete.arquivos.data.map((arq: StrapiFile) => arq.id).filter((id: number | undefined): id is number => id != null);
    } else if (Array.isArray(aulaEntryTypedDelete.arquivos)) {
      arquivosIdsExistentes = aulaEntryTypedDelete.arquivos.map((arq: StrapiFile) => arq.id).filter((id: number | undefined): id is number => id != null);
    } else if (aulaEntryTypedDelete.attributes?.arquivos?.data && Array.isArray(aulaEntryTypedDelete.attributes.arquivos.data)) {
      arquivosIdsExistentes = aulaEntryTypedDelete.attributes.arquivos.data.map((arq: StrapiFile) => arq.id).filter((id: number | undefined): id is number => id != null);
    }
    
    // Converter fileId para número para comparação correta
    const fileIdNum = parseInt(fileId, 10);
    
    // Filtrar removendo apenas o arquivo especificado
    const arquivosIds = arquivosIdsExistentes.filter((id: number) => id !== fileIdNum);

    // Atualizar aula removendo o arquivo
    // Usar a mesma estratégia do endpoint principal - tentar múltiplos identificadores
    const candidateIds = Array.from(
      new Set(
        [
          resolved.documentId,
          resolved.numericId,
          aulaTargetId,
        ].filter(Boolean)
      )
    );
    
    let updateResponse: Response | null = null;
    let lastErrorText = "";
    
    const updatePayload = {
      data: {
        arquivos: arquivosIds,
      },
    };
    
    for (const candidate of candidateIds) {
      updateResponse = await fetch(`${STRAPI_API_URL}/api/aulas/${candidate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (updateResponse.ok) {
        break;
      }

      lastErrorText = await updateResponse.text().catch(() => "");
      console.error(
        `[Aulas Files API DELETE] Update error (${candidate}): ${updateResponse.status} ${updateResponse.statusText}`,
        lastErrorText
      );
      
      if (updateResponse.status !== 404) {
        return NextResponse.json(
          { error: "Erro ao remover arquivo" },
          { status: updateResponse.status }
        );
      }
    }

    if (!updateResponse || !updateResponse.ok) {
      console.error(
        "[Aulas Files API DELETE] Nenhum identificador funcionou para atualizar a aula",
        lastErrorText
      );
      return NextResponse.json(
        { error: "Erro ao remover arquivo" },
        { status: 404 }
      );
    }

    // Buscar aula atualizada para retornar os dados atualizados
    const updatedAulaResponse = await fetch(
      `${STRAPI_API_URL}/api/aulas?${filterParam}&populate[arquivos][fields][0]=id&populate[arquivos][fields][1]=name&populate[arquivos][fields][2]=url&populate[arquivos][fields][3]=mime&populate[arquivos][fields][4]=size&populate[arquivos][fields][5]=createdAt&publicationState=preview`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (updatedAulaResponse.ok) {
      const updatedAulaData = await updatedAulaResponse.json();
      const updatedEntry = Array.isArray(updatedAulaData?.data)
        ? updatedAulaData.data[0]
        : updatedAulaData.data;
      
      return NextResponse.json({ data: updatedEntry, success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover arquivo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

