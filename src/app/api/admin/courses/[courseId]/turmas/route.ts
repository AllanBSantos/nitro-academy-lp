import { NextRequest, NextResponse } from "next/server";
import { MAX_SLOTS_PER_COURSE } from "@/config/constants";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

interface CronogramaItem {
  data_inicio?: string;
  data_fim?: string;
  dia_semana?: string;
  horario_aula?: string;
  link_aula?: string;
}

// Função auxiliar para converter horário "HH:MM" para minutos
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Função auxiliar para verificar se dois horários se sobrepõem (considerando 50 minutos de duração)
const hasTimeOverlap = (time1: string, time2: string, durationMinutes: number = 50): boolean => {
  const start1 = timeToMinutes(time1);
  const end1 = start1 + durationMinutes;
  const start2 = timeToMinutes(time2);
  const end2 = start2 + durationMinutes;

  // Verifica sobreposição: se um começa antes do outro terminar
  return (start1 < end2 && end1 > start2);
};

// Função para limpar dados recursivamente, removendo campos inválidos
const cleanDataRecursively = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map((item) => cleanDataRecursively(item));
  }

  if (data && typeof data === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>
    )) {
      // Remover campos que não devem ser enviados
      if (
        [
          "id",
          "documentId",
          "createdAt",
          "updatedAt",
          "publishedAt",
          "alunos",
          "cupons",
          "localizations",
          "createdBy",
          "updatedBy",
          "locale",
        ].includes(key)
      ) {
        continue;
      }

      if (value && typeof value === "object") {
        cleaned[key] = cleanDataRecursively(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  return data;
};

// GET - Buscar turmas do curso
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const courseId = params.courseId;

    // Buscar curso com cronograma e alunos
    const courseUrl = `${STRAPI_API_URL}/api/cursos?filters[id][$eq]=${courseId}&locale=pt-BR&populate[cronograma]=*&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[alunos][fields][1]=turma`;

    const courseResponse = await fetch(courseUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!courseResponse.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar curso" },
        { status: courseResponse.status }
      );
    }

    const courseData = await courseResponse.json();
    const course = courseData.data?.[0] || courseData.data || courseData;

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    const courseAttributes = course.attributes || course;
    const cronograma: CronogramaItem[] = courseAttributes.cronograma || [];
    const alunos = courseAttributes.alunos || course.alunos || [];

    // Contar alunos por turma (índice do cronograma)
    const alunosPorTurma: Record<number, number> = {};
    alunos.forEach((aluno: { turma?: number }) => {
      if (aluno.turma !== undefined && aluno.turma !== null) {
        // turma é 1-indexed, mas cronograma é 0-indexed
        const turmaIndex = aluno.turma - 1;
        if (turmaIndex >= 0 && turmaIndex < cronograma.length) {
          alunosPorTurma[turmaIndex] = (alunosPorTurma[turmaIndex] || 0) + 1;
        }
      }
    });

    // Transformar cronograma em turmas
    const turmas = cronograma.map((item, index) => {
      const currentStudents = alunosPorTurma[index] || 0;
      const maxStudents = MAX_SLOTS_PER_COURSE;

      // Converter dia_semana para formato usado no frontend
      const dayOfWeekMap: Record<string, string> = {
        "Segunda-Feira": "monday",
        "Terça-Feira": "tuesday",
        "Quarta-Feira": "wednesday",
        "Quinta-Feira": "thursday",
        "Sexta-Feira": "friday",
      };

      // Converter horario_aula de "BRT 14:00" para "14:00"
      const startTime = item.horario_aula
        ? item.horario_aula.replace("BRT ", "")
        : "";

      return {
        id: index + 1, // 1-indexed para compatibilidade
        index, // 0-indexed para manipulação
        dayOfWeek: dayOfWeekMap[item.dia_semana || ""] || "",
        startTime,
        maxStudents,
        currentStudents,
        dia_semana: item.dia_semana,
        horario_aula: item.horario_aula,
        data_inicio: item.data_inicio,
        data_fim: item.data_fim,
        link_aula: item.link_aula,
      };
    });

    return NextResponse.json({
      success: true,
      data: turmas,
    });
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Adicionar nova turma
export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const courseId = params.courseId;
    const body = await request.json();
    const { dayOfWeek, startTime } = body;

    if (!dayOfWeek || !startTime) {
      return NextResponse.json(
        { error: "Dia da semana e horário são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar curso atual usando filters por ID
    const courseUrl = `${STRAPI_API_URL}/api/cursos?filters[id][$eq]=${courseId}&locale=pt-BR&populate[cronograma]=*`;

    const courseResponse = await fetch(courseUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!courseResponse.ok) {
      const errorText = await courseResponse.text();
      console.error("Erro ao buscar curso:", courseResponse.status, errorText);
      return NextResponse.json(
        { error: "Erro ao buscar curso" },
        { status: courseResponse.status }
      );
    }

    const courseData = await courseResponse.json();
    const course = courseData.data?.[0];

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    const courseAttributes = course.attributes || course;
    const documentId = course.documentId || course.id;
    const currentCronograma: CronogramaItem[] = courseAttributes.cronograma || [];

    // Converter dayOfWeek para formato do Strapi
    const dayOfWeekMap: Record<string, string> = {
      monday: "Segunda-Feira",
      tuesday: "Terça-Feira",
      wednesday: "Quarta-Feira",
      thursday: "Quinta-Feira",
      friday: "Sexta-Feira",
    };

    // Buscar valores válidos do enum do Strapi
    const optionsUrl = `${STRAPI_API_URL}/api/content-type-builder/components/components.cronograma.cronograma`;
    const optionsResponse = await fetch(optionsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      cache: "no-store",
    });

    let validTimes: string[] = [];
    if (optionsResponse.ok) {
      const optionsData = await optionsResponse.json();
      const attributes = optionsData.data?.attributes || optionsData.attributes || {};
      const horarioAulaOptions = attributes.horario_aula?.enum || [];
      // Remover prefixo "BRT " dos horários para validação
      validTimes = horarioAulaOptions.map((horario: string) => 
        horario.replace(/^BRT\s+/, "")
      );
    } else {
      // Fallback para valores padrão
      validTimes = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
    }

    // Validar horário - deve ser um dos valores válidos do enum
    if (!validTimes.includes(startTime)) {
      return NextResponse.json(
        { error: "Horário inválido. Use apenas os horários disponíveis." },
        { status: 400 }
      );
    }

    // Converter startTime para formato "BRT HH:MM" (formato do enum do Strapi)
    const formattedTime = `BRT ${startTime}`;
    const diaSemanaStrapi = dayOfWeekMap[dayOfWeek] || dayOfWeek;

    // Verificar se já existe uma turma com o mesmo dia e horário
    const duplicateExists = currentCronograma.some(
      (item) =>
        item.dia_semana === diaSemanaStrapi &&
        item.horario_aula === formattedTime
    );

    if (duplicateExists) {
      return NextResponse.json(
        { error: "Já existe uma turma cadastrada com este dia e horário." },
        { status: 400 }
      );
    }

    // Verificar sobreposição de horários (aula dura 50 minutos)
    const hasOverlap = currentCronograma.some((item) => {
      // Só verifica sobreposição se for no mesmo dia
      if (item.dia_semana !== diaSemanaStrapi) {
        return false;
      }

      // Extrair horário sem "BRT " para comparação
      const existingTime = item.horario_aula?.replace(/^BRT\s+/, "") || "";
      
      if (!existingTime) {
        return false;
      }

      return hasTimeOverlap(startTime, existingTime, 50);
    });

    if (hasOverlap) {
      return NextResponse.json(
        {
          error:
            "Este horário se sobrepõe com uma turma existente. A aula dura 50 minutos.",
        },
        { status: 400 }
      );
    }

    // Adicionar novo item ao cronograma
    const newCronogramaItem: CronogramaItem = {
      dia_semana: diaSemanaStrapi,
      horario_aula: formattedTime,
    };

    const updatedCronograma = [...currentCronograma, newCronogramaItem];

    // Preparar dados para atualização - limpar recursivamente e atualizar cronograma
    const cleanedData = cleanDataRecursively(courseAttributes) as Record<string, unknown>;
    
    // Atualizar cronograma
    cleanedData.cronograma = cleanDataRecursively(updatedCronograma);

    // Se tiver imagem, enviar apenas o ID
    if (courseAttributes.imagem && typeof courseAttributes.imagem === "object") {
      const imagem = courseAttributes.imagem as { id?: number };
      if (imagem.id) {
        cleanedData.imagem = imagem.id;
      }
    }

    // Atualizar curso usando documentId
    const updateUrl = `${STRAPI_API_URL}/api/cursos/${documentId}?locale=pt-BR`;
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        data: cleanedData,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("Erro ao atualizar curso:", updateResponse.status, errorText);
      return NextResponse.json(
        { error: "Erro ao adicionar turma" },
        { status: updateResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Turma adicionada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao adicionar turma:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Reordenar turmas
export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const courseId = params.courseId;
    const body = await request.json();
    const { newOrder } = body; // Array de índices na nova ordem

    if (!Array.isArray(newOrder)) {
      return NextResponse.json(
        { error: "newOrder deve ser um array" },
        { status: 400 }
      );
    }

    // Buscar curso atual usando filters por ID
    const courseUrl = `${STRAPI_API_URL}/api/cursos?filters[id][$eq]=${courseId}&locale=pt-BR&populate[cronograma]=*&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[alunos][fields][1]=turma`;

    const courseResponse = await fetch(courseUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!courseResponse.ok) {
      const errorText = await courseResponse.text();
      console.error("Erro ao buscar curso:", courseResponse.status, errorText);
      return NextResponse.json(
        { error: "Erro ao buscar curso" },
        { status: courseResponse.status }
      );
    }

    const courseData = await courseResponse.json();
    const course = courseData.data?.[0];

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    const courseAttributes = course.attributes || course;
    const documentId = course.documentId || course.id;
    const currentCronograma: CronogramaItem[] = courseAttributes.cronograma || [];
    const alunos = courseAttributes.alunos || course.alunos || [];

    // Verificar se alguma turma que será movida tem alunos
    for (let i = 0; i < newOrder.length; i++) {
      const oldIndex = newOrder[i];
      if (oldIndex !== i) {
        // Turma está sendo movida
        const alunosNaTurma = alunos.filter(
          (aluno: { turma?: number }) => aluno.turma === oldIndex + 1
        );
        if (alunosNaTurma.length > 0) {
          return NextResponse.json(
            {
              error:
                "Não é possível reordenar turmas com alunos matriculados",
            },
            { status: 400 }
          );
        }
      }
    }

    // Reordenar cronograma
    const reorderedCronograma = newOrder.map(
      (oldIndex) => currentCronograma[oldIndex]
    );

    // Preparar dados para atualização - limpar recursivamente e atualizar cronograma
    const cleanedData = cleanDataRecursively(courseAttributes) as Record<string, unknown>;
    
    // Atualizar cronograma
    cleanedData.cronograma = cleanDataRecursively(reorderedCronograma);

    // Se tiver imagem, enviar apenas o ID
    if (courseAttributes.imagem && typeof courseAttributes.imagem === "object") {
      const imagem = courseAttributes.imagem as { id?: number };
      if (imagem.id) {
        cleanedData.imagem = imagem.id;
      }
    }

    // Atualizar curso usando documentId
    const updateUrl = `${STRAPI_API_URL}/api/cursos/${documentId}?locale=pt-BR`;
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        data: cleanedData,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("Erro ao reordenar turmas:", updateResponse.status, errorText);
      return NextResponse.json(
        { error: "Erro ao reordenar turmas" },
        { status: updateResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Turmas reordenadas com sucesso",
    });
  } catch (error) {
    console.error("Erro ao reordenar turmas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Remover turma
export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const courseId = params.courseId;
    const { searchParams } = new URL(request.url);
    const turmaIndex = parseInt(searchParams.get("index") || "-1", 10);

    if (turmaIndex < 0) {
      return NextResponse.json(
        { error: "Índice da turma é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar curso atual usando filters por ID
    const courseUrl = `${STRAPI_API_URL}/api/cursos?filters[id][$eq]=${courseId}&locale=pt-BR&populate[cronograma]=*&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[alunos][fields][1]=turma`;

    const courseResponse = await fetch(courseUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!courseResponse.ok) {
      const errorText = await courseResponse.text();
      console.error("Erro ao buscar curso:", courseResponse.status, errorText);
      return NextResponse.json(
        { error: "Erro ao buscar curso" },
        { status: courseResponse.status }
      );
    }

    const courseData = await courseResponse.json();
    const course = courseData.data?.[0];

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    const courseAttributes = course.attributes || course;
    const documentId = course.documentId || course.id;
    const currentCronograma: CronogramaItem[] = courseAttributes.cronograma || [];
    const alunos = courseAttributes.alunos || course.alunos || [];

    // Verificar se a turma tem alunos (turma é 1-indexed)
    const alunosNaTurma = alunos.filter(
      (aluno: { turma?: number }) => aluno.turma === turmaIndex + 1
    );

    if (alunosNaTurma.length > 0) {
      return NextResponse.json(
        {
          error: "Não é possível remover turmas com alunos matriculados",
        },
        { status: 400 }
      );
    }

    // Remover item do cronograma
    const updatedCronograma = currentCronograma.filter(
      (_, index) => index !== turmaIndex
    );

    // Preparar dados para atualização - limpar recursivamente e atualizar cronograma
    const cleanedData = cleanDataRecursively(courseAttributes) as Record<string, unknown>;
    
    // Atualizar cronograma
    cleanedData.cronograma = cleanDataRecursively(updatedCronograma);

    // Se tiver imagem, enviar apenas o ID
    if (courseAttributes.imagem && typeof courseAttributes.imagem === "object") {
      const imagem = courseAttributes.imagem as { id?: number };
      if (imagem.id) {
        cleanedData.imagem = imagem.id;
      }
    }

    // Atualizar curso usando documentId
    const updateUrl = `${STRAPI_API_URL}/api/cursos/${documentId}?locale=pt-BR`;
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        data: cleanedData,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("Erro ao remover turma:", updateResponse.status, errorText);
      return NextResponse.json(
        { error: "Erro ao remover turma" },
        { status: updateResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Turma removida com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover turma:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

