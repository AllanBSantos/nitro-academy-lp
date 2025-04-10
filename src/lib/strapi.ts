import { Course, Mentor, Review } from "@/types/strapi";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function fetchCourses(
  locale: string = "pt-BR"
): Promise<Course[]> {
  // First try with locale
  const response = await fetch(
    `${STRAPI_API_URL}/api/cursos?populate[mentor][populate]=imagem&populate=imagem&locale=${locale}&pagination[pageSize]=100`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Response status:", response.status);
    console.error("Response text:", await response.text());
    throw new Error("Failed to fetch courses");
  }

  const result = await response.json();
  console.log("Courses API Response:", JSON.stringify(result, null, 2));

  // If no results with locale, try without locale
  if (!result.data || result.data.length === 0) {
    console.log("No results with locale, trying without locale");
    const fallbackResponse = await fetch(
      `${STRAPI_API_URL}/api/cursos?populate[mentor][populate]=imagem&populate=imagem&pagination[pageSize]=100`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
      }
    );

    if (!fallbackResponse.ok) {
      throw new Error("Failed to fetch courses");
    }

    const fallbackResult = await fallbackResponse.json();
    console.log("Fallback Response:", JSON.stringify(fallbackResult, null, 2));
    return fallbackResult.data || [];
  }

  return result.data;
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
