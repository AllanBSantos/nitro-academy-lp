import { fetchCourses } from "@/lib/strapi";
import { CardProps } from "@/types/card";

export async function getCardsContent(
  locale: string = "pt"
): Promise<CardProps[]> {
  if (locale === "pt") {
    locale = "pt-BR";
  }
  const courses = await fetchCourses();

  const shuffledCourses = [...courses].sort(() => Math.random() - 0.5);

  return shuffledCourses.map((course) => {
    const mentor = course.mentor;
    const mentorImage = mentor?.imagem;
    const courseImage = course.imagem;
    const videos = course.videos || [];

    const buildUrl = (url?: string) => {
      if (!url) return "";
      return url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
    };

    const mappedCourse = {
      id: course.id.toString(),
      documentId: course.documentId,
      slug: course.slug,
      title: course.titulo || "",
      description: course.descricao || "",
      mentor: {
        name: mentor?.nome || "",
        image: buildUrl(mentorImage?.url),
        students: mentor?.alunos || 0,
        courses: mentor?.cursos || 0,
        profissao: mentor?.profissao || "",
        descricao: mentor?.descricao || "",
        instagram: mentor?.instagram || "",
        instagram_label: mentor?.instagram_label || "",
        pais: mentor?.pais || "Brasil",
        reviews: mentor?.reviews || null,
      },
      rating: course.nota || null,
      price: {
        installment: course.preco / course.parcelas || 0,
        total: course.preco || 0,
        installments: course.parcelas || 0,
        moeda: course.moeda || "Real",
      },
      image: buildUrl(courseImage?.url),
      nivel: course.nivel || "",
      modelo: course.modelo || "",
      pre_requisitos: course.pre_requisitos || "",
      projetos: course.projetos || "",
      tarefa_de_casa: course.tarefa_de_casa || "",
      informacoes_adicionais: course.informacoes_adicionais || "",
      link_pagamento: course.link_pagamento || "",
      link_desconto: course.link_desconto || null,
      inscricoes_abertas: course.inscricoes_abertas,
      aviso_matricula: course.aviso_matricula || "",
      topicosRelacionados: course.tags?.map((tag) => tag.nome) || [],
      videos,
      cronograma: Array.isArray(course.cronograma)
        ? course.cronograma.map((item) => ({
            dia: item.dia_semana || "",
            horario: item.horario_aula || "",
            dia_semana: item.dia_semana,
            horario_aula: item.horario_aula,
            data_inicio: item.data_inicio || "",
            data_fim: item.data_fim,
            faixa_etaria: item.faixa_etaria || "",
          }))
        : [],
      moeda: course.moeda || "Real",
      lingua: course.lingua || "portugues",
      cupons: (course.cupons || []).map((coupon, index) => ({
        id: index + 1,
        documentId: `coupon_${index + 1}`,
        nome: coupon.nome || "",
        url: coupon.url || null,
        valido: coupon.valido || false,
        validade: coupon.validade || null,
        voucher_gratuito: coupon.voucher_gratuito || false,
      })),
      badge: course.badge || undefined,
      ementa_resumida: course.ementa_resumida || [],
      resumo_aulas: course.resumo_aulas || [],
      competencias: course.competencias || "",
      sugestao_horario: course.sugestao_horario ?? true,
      alunos: course.alunos || [],
      data_inicio_curso: course.data_inicio_curso || "",
      reviews: (() => {
        if (Array.isArray(course.review)) {
          const mappedReviews = course.review.map((review) => {
            return {
              id: review.id,
              studentName: review.nome || "",
              rating: Number(review.nota ?? 0),
              comment: review.descricao || "",
            };
          });

          return mappedReviews;
        }
        return [];
      })(),
    };
    return mappedCourse;
  });
}
