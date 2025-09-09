import { NextResponse } from "next/server";

export async function GET() {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    if (!STRAPI_URL) {
      return NextResponse.json(
        { error: "STRAPI_URL não configurado" },
        { status: 500 }
      );
    }

    const lessonsResponse = await fetch(
      `${STRAPI_URL}/api/aulas?populate=*&sort[0]=data:asc`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!lessonsResponse.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar aulas" },
        { status: 500 }
      );
    }

    const lessonsData = await lessonsResponse.json();
    const lessons = lessonsData.data || [];

    const processedLessons = lessons.map(
      (lesson: {
        id: number;
        data: string;
        aula_status: string;
        link_aula: string;
        arquivos: Array<{
          url: string;
          name: string;
          ext: string;
        }>;
        curso: {
          id: number;
          titulo: string;
        } | null;
      }) => {
        const lessonDate = new Date(lesson.data);
        const now = new Date();

        const timeDiffMinutes = Math.floor(
          (lessonDate.getTime() - now.getTime()) / (1000 * 60)
        );

        const isToday = lessonDate.toDateString() === now.toDateString();
        const isPast = lessonDate < now;
        const isFuture = lessonDate > now;

        const isInProgress = isToday && Math.abs(timeDiffMinutes) <= 30; // 30 minutos antes ou depois

        let calculatedStatus = "PENDENTE";

        if (isPast) {
          calculatedStatus = "CONCLUÍDA";
        } else if (isInProgress) {
          calculatedStatus = "EM ANDAMENTO";
        } else if (isFuture) {
          calculatedStatus = "PENDENTE";
        }

        let canJoin = false;

        if (isInProgress || (isToday && calculatedStatus === "PENDENTE")) {
          canJoin = true;
        }

        return {
          id: lesson.id,
          data: lesson.data,
          aula_status: calculatedStatus, // Usar o status calculado
          link_aula: lesson.link_aula,
          arquivos: lesson.arquivos || [],
          curso: lesson.curso
            ? {
                id: lesson.curso.id,
                titulo: lesson.curso.titulo,
              }
            : null,
          isToday,
          isPast,
          isFuture,
          isInProgress,
          canJoin,
          timeDiffMinutes,
          formattedDate: lessonDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          formattedTime: lessonDate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }
    );

    return NextResponse.json({ lessons: processedLessons });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
