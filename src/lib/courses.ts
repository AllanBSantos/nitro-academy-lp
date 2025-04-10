import { fetchCourses } from "@/lib/strapi";
import { CardProps } from "@/components/Card";

export async function getCardsContent(
  locale: string = "pt"
): Promise<CardProps[]> {
  if (locale === "pt") {
    locale = "pt-BR";
  }
  const courses = await fetchCourses(locale);

  return courses.map((course) => {
    const mentor = course.mentor;
    const mentorImage = mentor?.imagem;
    const courseImage = course.imagem;
    const videos = course.videos || [];

    return {
      id: course.id.toString(),
      titleKey: course.titulo || "",
      descriptionKey: course.descricao || "",
      mentor: {
        name: mentor?.nome || "",
        image: mentorImage?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${mentorImage.url}`
          : "",
        students: mentor?.alunos || 0,
        courses: mentor?.cursos || 0,
        profissao: mentor?.profissao || "",
        nota: mentor?.nota || 0,
        avaliacoes: mentor?.avaliacoes || 0,
        descricao: mentor?.descricao || "",
        instagram: mentor?.instagram || "",
      },
      rating: course.nota || 0,
      price: {
        installment: course.preco / course.parcelas || 0,
        total: course.preco || 0,
      },
      image: courseImage?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${courseImage.url}`
        : "",
      nivel: course.nivel || "",
      modelo: course.modelo || "",
      objetivo: course.objetivo || "",
      pre_requisitos: course.pre_requisitos || "",
      projetos: course.projetos || "",
      tarefa_de_casa: course.tarefa_de_casa || "",
      topicosRelacionados: course.tags?.map((tag) => tag.nome) || [],
      videos,
    };
  });
}
