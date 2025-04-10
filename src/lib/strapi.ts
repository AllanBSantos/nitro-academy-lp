import { Course, Mentor, Review } from "@/types/strapi";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function fetchCourses(
  locale: string = "pt-BR"
): Promise<Course[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/cursos?fields[0]=id&fields[1]=titulo&fields[2]=descricao&fields[3]=nota&fields[4]=nivel&fields[5]=modelo&fields[6]=objetivo&fields[7]=pre_requisitos&fields[8]=projetos&fields[9]=tarefa_de_casa&fields[10]=preco&fields[11]=parcelas&fields[12]=destaques&populate[imagem][fields][0]=url&populate[mentor][populate][imagem][fields][0]=url&populate[videos][populate]=video&locale=${locale}&_=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    const data = await response.json();
    console.log("Strapi response:", data);
    return data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function fetchCourse(
  id: string,
  locale: string = "pt-BR"
): Promise<Course> {
  const response = await fetch(
    `${STRAPI_API_URL}/api/cursos/${id}?populate=*&locale=${locale}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  const { data } = await response.json();
  return data;
}

export async function fetchMentor(
  id: number,
  locale: string = "pt-BR"
): Promise<Mentor> {
  const response = await fetch(
    `${STRAPI_API_URL}/api/mentores/${id}?populate=*&locale=${locale}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch mentor");
  }

  const { data } = await response.json();
  return data;
}

export async function fetchReviews(
  courseId: string,
  locale: string = "pt-BR"
): Promise<Review[]> {
  const response = await fetch(
    `${STRAPI_API_URL}/api/avaliacoes?filters[curso][id][$eq]=${courseId}&populate=*&locale=${locale}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const { data } = await response.json();
  return data;
}
