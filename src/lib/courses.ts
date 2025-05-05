import { fetchCourses } from "@/lib/strapi";
import { CardProps } from "@/components/Card";

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

    return {
      id: course.id.toString(),
      slug: course.slug,
      title: course.titulo || "",
      description: course.descricao || "",
      mentor: {
        name: mentor?.nome || "",
        image: buildUrl(mentorImage?.url),
        students: mentor?.alunos || 0,
        courses: mentor?.cursos || 0,
        profissao: mentor?.profissao || "",
        nota: mentor?.nota || 0,
        avaliacoes: mentor?.avaliacoes || 0,
        descricao: mentor?.descricao || "",
        instagram: mentor?.instagram || "",
        instagram_label: mentor?.instagram_label || "",
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
      objetivo: course.objetivo || "",
      pre_requisitos: course.pre_requisitos || "",
      projetos: course.projetos || "",
      tarefa_de_casa: course.tarefa_de_casa || "",
      informacoes_adicionais: course.informacoes_adicionais || "",
      link_pagamento: course.link_pagamento || "",
      topicosRelacionados: course.tags?.map((tag) => tag.nome) || [],
      videos,
      cronograma: Array.isArray(course.cronograma) ? course.cronograma : [],
      moeda: course.moeda || "Real",
      cupons: course.cupons || [],
      badge: course.badge || null,
      ementa_resumida: course.ementa_resumida || [],
      resumo_aulas: course.resumo_aulas || [],
    };
  });
}
