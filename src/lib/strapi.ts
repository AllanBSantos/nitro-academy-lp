/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Course,
  Mentor,
  Review,
  Escola,
  PartnerSchool,
  ReviewCard,
} from "@/types/strapi";
import { normalizeName } from "@/lib/utils";
import { MAX_SLOTS_PER_COURSE } from "@/config/constants";
import {
  COURSE_QUERY_ADMIN_PARAMS,
  COURSE_QUERY_PUBLIC_PARAMS,
} from "@/lib/strapiCourseQuery";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const buildStrapiAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (process.env.STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_TOKEN}`;
  }
  return headers;
};

const cleanDataRecursively = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.map((item) => cleanDataRecursively(item));
  }

  if (data && typeof data === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>
    )) {
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
          "imagem",
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

interface FetchCoursesOptions {
  scope?: "public" | "admin";
}

export async function fetchCourses(
  options: FetchCoursesOptions = {}
): Promise<Course[]> {
  try {
    // Garantir que sempre use pt-BR (hardcoded)
    const localeToUse = "pt-BR";
    const scope = options.scope ?? "public";
    const queryParams =
      scope === "admin"
        ? COURSE_QUERY_ADMIN_PARAMS
        : COURSE_QUERY_PUBLIC_PARAMS;

    // No servidor, precisamos usar URL absoluta ou chamar Strapi diretamente
    // Vamos chamar Strapi diretamente no servidor para evitar problemas com URL relativa
    const isServer = typeof window === "undefined";

    if (isServer) {
      // No servidor: chamar Strapi diretamente com autenticação
      const ADMIN_TOKEN = process.env.STRAPI_TOKEN;
      const url = `${STRAPI_API_URL}/api/cursos?filters[habilitado][$eq]=true&locale=${localeToUse}&${queryParams}&sort=createdAt:desc`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(
          `Failed to fetch courses from Strapi: ${response.status} ${response.statusText}`,
          errorText
        );
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } else {
      // No cliente: usar rota Next.js
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const response = await fetch(
        `${baseUrl}/api/courses?locale=${localeToUse}`,
        {
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(
          `Failed to fetch courses: ${response.status} ${response.statusText}`,
          errorText
        );
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// Função para buscar cursos com dados de matrícula para o dashboard admin
export async function fetchCoursesWithEnrollment(): Promise<
  Array<{
    id: string;
    documentId: string;
    name: string;
    campaign: string;
    enrolled: number;
    available: number;
    total: number;
  }>
> {
  try {
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;
    const localeToUse = "pt-BR";
    const isServer = typeof window === "undefined";

    let courses: any[] = [];

    if (isServer) {
      // No servidor: chamar Strapi diretamente com autenticação
      // Populando alunos com filtro habilitado = true
      const url = `${STRAPI_API_URL}/api/cursos?filters[habilitado][$eq]=true&locale=${localeToUse}&populate[cronograma][fields][0]=dia_semana&populate[cronograma][fields][1]=horario_aula&populate[cronograma][fields][2]=data_inicio&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[campanhas][fields][0]=id&populate[campanhas][fields][1]=nome&populate[campanhas][fields][2]=createdAt&fields[0]=id&fields[1]=titulo&sort=createdAt:desc`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      courses = data.data || [];
    } else {
      // No cliente: usar rota Next.js
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const response = await fetch(
        `${baseUrl}/api/courses?locale=${localeToUse}`,
        {
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      courses = data.data || [];
    }

    return courses.map((course: any) => {
      // Normalizar estrutura de dados (pode vir com ou sem attributes)
      const courseData = course.attributes || course;

      // Obter alunos do curso (pode estar em courseData.alunos ou courseData.alunos.data)
      const alunosRaw = courseData.alunos?.data || courseData.alunos || [];
      const alunosArray = Array.isArray(alunosRaw) ? alunosRaw : [];

      // Filtrar apenas alunos habilitados
      const alunosHabilitados = alunosArray.filter((aluno: any) => {
        // Normalizar estrutura do aluno (pode vir com ou sem attributes)
        const alunoData = aluno.attributes || aluno;
        // Verificar se o aluno tem habilitado = true
        const habilitado = alunoData?.habilitado ?? true; // Default true se não especificado
        return habilitado === true;
      });

      const enrolled = alunosHabilitados.length;

      // Calcular total de vagas: número de turmas (schedules) × vagas por turma
      const cronogramaRaw = courseData.cronograma || [];
      const cronogramaArray = Array.isArray(cronogramaRaw) ? cronogramaRaw : [];
      const numberOfSchedules = cronogramaArray.length;
      const totalSlots = numberOfSchedules * MAX_SLOTS_PER_COURSE;

      const available = Math.max(0, totalSlots - enrolled);

      // Usar a campanha real do Strapi ou fallback para data de início
      let campaign = "2024.1"; // Valor padrão

      // Normalizar campanhas (pode estar em courseData.campanhas ou courseData.campanhas.data)
      const campanhasRaw =
        courseData.campanhas?.data || courseData.campanhas || [];
      const campanhasArray = Array.isArray(campanhasRaw) ? campanhasRaw : [];

      if (campanhasArray.length > 0) {
        // Normalizar primeira campanha
        const primeiraCampanha = campanhasArray[0];
        const campanhaData = primeiraCampanha.attributes || primeiraCampanha;
        campaign = campanhaData.nome || campaign;
      } else if (courseData.cronograma?.[0]?.data_inicio) {
        // Fallback para data de início se não houver campanha
        const startDate = courseData.cronograma[0].data_inicio;
        const date = new Date(startDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        campaign = `${year}.${month <= 6 ? 1 : 2}`;
      }

      return {
        id: (courseData.id || course.id || "").toString(),
        documentId: courseData.documentId || course.documentId || "",
        name: courseData.titulo || "",
        campaign,
        enrolled,
        available,
        total: totalSlots,
      };
    });
  } catch (error) {
    console.error("Error fetching courses with enrollment:", error);
    return [];
  }
}

// Função para buscar cursos com progresso do aluno (mockado por enquanto)
export async function fetchStudentCoursesWithProgress(): Promise<
  Array<{
    id: number;
    name: string;
    mentor: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    spinners: number;
    image: string;
    status: "active" | "completed" | "locked";
    nextLesson: string | null;
  }>
> {
  try {
    // Usar a função existente fetchCourses
    const courses = await fetchCourses();

    return courses.map((course: any, index: number) => {
      // Simular progresso baseado no índice (para demonstração)
      const progressValues = [68, 45, 100, 22];
      const totalLessonsValues = [24, 20, 18, 16];
      const completedLessonsValues = [16, 9, 18, 3];
      const spinnersValues = [850, 420, 950, 180];
      const statusValues: Array<"active" | "completed" | "locked"> = [
        "active",
        "active",
        "completed",
        "active",
      ];
      const nextLessonValues = [
        "Machine Learning Básico",
        "Validação de Ideias",
        null,
        "Comunicação Eficaz",
      ];

      const progress = progressValues[index % progressValues.length];
      const totalLessons =
        totalLessonsValues[index % totalLessonsValues.length];
      const completedLessons =
        completedLessonsValues[index % completedLessonsValues.length];
      const spinners = spinnersValues[index % spinnersValues.length];
      const status = statusValues[index % statusValues.length];
      const nextLesson = nextLessonValues[index % nextLessonValues.length];

      return {
        id: course.id,
        name: course.titulo,
        mentor: course.mentor?.nome || "Professor",
        progress,
        totalLessons,
        completedLessons,
        spinners,
        image:
          course.imagem?.url ||
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
        status,
        nextLesson,
      };
    });
  } catch (error) {
    console.error("Error fetching student courses with progress:", error);
    return [];
  }
}

export async function fetchCourse(documentId: string): Promise<Course> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/cursos?filters[documentId][$eq]=${documentId}&locale=pt-BR&${COURSE_QUERY_ADMIN_PARAMS}&publicationState=preview`
      /* {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      } */
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        `Failed to fetch course: ${response.status} ${response.statusText}`
      );
    }

    const { data } = await response.json();
    if (!data || !data[0]) {
      throw new Error("No course data received from API");
    }
    return data[0];
  } catch (error) {
    console.error("Error in fetchCourse:", error);
    throw error;
  }
}

export async function fetchCourseWithAdminToken(
  documentId: string,
  queryString?: string
): Promise<Course> {
  const headers = buildStrapiAuthHeaders();

  if (
    !headers ||
    (typeof headers === "object" && !("Authorization" in headers))
  ) {
    throw new Error(
      "STRAPI_TOKEN não configurado para chamadas administrativas"
    );
  }

  const defaultQuery =
    "fields[0]=id&fields[1]=titulo&fields[2]=descricao&fields[3]=nota&fields[4]=nivel&fields[5]=modelo&fields[6]=pre_requisitos&fields[7]=projetos&fields[8]=tarefa_de_casa&fields[9]=preco&fields[10]=parcelas&fields[11]=slug&fields[12]=link_pagamento&fields[13]=moeda&fields[14]=informacoes_adicionais&fields[15]=badge&fields[16]=link_desconto&fields[17]=competencias&fields[18]=sugestao_horario&fields[19]=inscricoes_abertas&fields[20]=data_inicio_curso&fields[21]=lingua&fields[22]=aviso_matricula&fields[23]=plano&fields[24]=habilitado&populate[imagem][fields][0]=url&populate[mentor][populate][imagem][fields][0]=url&populate[mentor][fields][0]=nome&populate[mentor][fields][1]=profissao&populate[mentor][fields][2]=descricao&populate[mentor][fields][3]=alunos&populate[mentor][fields][4]=cursos&populate[mentor][fields][5]=instagram&populate[mentor][fields][6]=instagram_label&populate[mentor][fields][7]=linkedin_url&populate[mentor][fields][8]=linkedin_label&populate[mentor][fields][9]=pais&populate[mentor][fields][10]=documentId&populate[mentor][populate][reviews]=*&populate[videos][populate]=video&populate[tags][fields][0]=nome&populate[cronograma][fields][0]=data_fim&populate[cronograma][fields][1]=data_inicio&populate[cronograma][fields][2]=dia_semana&populate[cronograma][fields][3]=horario_aula&populate[cronograma][fields][4]=link_aula&populate[cupons][fields][0]=nome&populate[cupons][fields][1]=url&populate[cupons][fields][2]=valido&populate[cupons][fields][3]=validade&populate[cupons][fields][4]=voucher_gratuito&populate[ementa_resumida][fields][0]=descricao&populate[resumo_aulas][fields][0]=nome_aula&populate[resumo_aulas][fields][1]=descricao_aula&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[alunos][fields][1]=turma&populate[alunos][fields][2]=documentId&populate[alunos][fields][3]=nome&populate[alunos][fields][4]=email_responsavel&populate[alunos][fields][5]=telefone_aluno&populate[alunos][fields][6]=escola_parceira&populate[alunos][fields][7]=createdAt&populate[review][fields][0]=id&populate[review][fields][1]=nota&populate[review][fields][2]=descricao&populate[review][fields][3]=nome";

  const url = `${STRAPI_API_URL}/api/cursos?filters[documentId][$eq]=${documentId}&locale=pt-BR&${
    queryString || defaultQuery
  }`;

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Admin course fetch error:", {
      status: response.status,
      statusText: response.statusText,
      errorData,
    });
    throw new Error(
      `Failed to fetch course: ${response.status} ${response.statusText}`
    );
  }

  const { data } = await response.json();
  if (!data || !data[0]) {
    throw new Error("No course data received from API");
  }
  return data[0];
}

export async function fetchMentor(id: number): Promise<Mentor> {
  const response = await fetch(
    `${STRAPI_API_URL}/api/mentores/${id}?populate=*&locale=pt-BR`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch mentor");
  }

  const { data } = await response.json();
  return data;
}

export async function fetchAllMentors(
  locale: string = "pt-BR"
): Promise<Mentor[]> {
  try {
    // Usar rota Next.js que faz autenticação internamente
    const response = await fetch(`/api/mentors?locale=${locale}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch mentors");
    }

    const data = await response.json();

    // Handle both Strapi v4 structure (data.data) and direct structure (data)
    const mentors = data.data || data;

    if (!Array.isArray(mentors) || mentors.length === 0) {
      return [];
    }

    // Os mentores já vêm processados da API com cursos e alunos calculados
    // Apenas garantir que o formato está correto
    const processedMentors: Mentor[] = mentors.map((mentor: any) => {
      return mentor as Mentor;
    });

    return processedMentors;
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
}

export async function fetchReviews(courseId: string): Promise<Review[]> {
  const response = await fetch(
    `${STRAPI_API_URL}/api/avaliacoes?filters[curso][id][$eq]=${courseId}&populate=*&locale=pt-BR`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const { data } = await response.json();
  return data;
}

export async function fetchAllReviews(): Promise<ReviewCard[]> {
  try {
    const url = `${STRAPI_API_URL}/api/avaliacoes?populate=*&sort=createdAt:desc`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch reviews: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Transform reviews to ReviewCard format
    const reviewCards: ReviewCard[] =
      data.data?.map((review: any) => {
        // Determine gender based on name (simple heuristic)
        const name = review.attributes?.aluno || review.aluno || "Usuário";
        const firstName = name.split(" ")[0].toLowerCase();
        const isGirlName = [
          "maria",
          "ana",
          "julia",
          "beatriz",
          "marina",
          "sofia",
          "lara",
          "laura",
          "carolina",
          "fernanda",
          "camila",
          "leticia",
          "isabella",
          "valentina",
          "alessandra",
          "alice",
          "anne",
          "gabrielle",
        ].includes(firstName);

        // Format date
        const createdAt = review.attributes?.createdAt || review.createdAt;
        const date = createdAt ? formatReviewDate(createdAt) : "Recentemente";

        return {
          id: review.id,
          name: name,
          gender: isGirlName ? "girl" : "boy",
          rating: review.attributes?.nota || review.nota || 5,
          comment: review.attributes?.descricao || review.descricao || "",
          date: date,
        };
      }) || [];

    return reviewCards;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function fetchTestimonials(
  locale: string = "pt-BR"
): Promise<ReviewCard[]> {
  try {
    // Try different possible endpoints for testimonials (only avaliacoes exists)
    const possibleEndpoints = [
      `${STRAPI_API_URL}/api/avaliacoes?populate=*&sort=createdAt:desc&locale=${locale}`,
      // Try without locale
      `${STRAPI_API_URL}/api/avaliacoes?populate=*&sort=createdAt:desc`,
      // Try with preview state
      `${STRAPI_API_URL}/api/avaliacoes?populate=*&sort=createdAt:desc&publicationState=preview`,
      `${STRAPI_API_URL}/api/avaliacoes?populate=*&sort=createdAt:desc&locale=${locale}&publicationState=preview`,
    ];

    for (const url of possibleEndpoints) {
      try {
        const response = await fetch(url, {
          next: { revalidate: 60 },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.data && data.data.length > 0) {
            // Transform testimonials to ReviewCard format
            const testimonials: ReviewCard[] = data.data.map(
              (testimonial: any) => {
                // Determine gender based on name (simple heuristic)
                const name =
                  testimonial.attributes?.nome ||
                  testimonial.attributes?.aluno ||
                  testimonial.nome ||
                  testimonial.aluno ||
                  "Usuário";
                const firstName = name.split(" ")[0].toLowerCase();
                const isGirlName = [
                  "maria",
                  "ana",
                  "julia",
                  "beatriz",
                  "marina",
                  "sofia",
                  "lara",
                  "laura",
                  "carolina",
                  "fernanda",
                  "camila",
                  "leticia",
                  "isabella",
                  "valentina",
                ].includes(firstName);

                // Format date
                const createdAt =
                  testimonial.attributes?.createdAt || testimonial.createdAt;
                const date = createdAt
                  ? formatReviewDate(createdAt)
                  : "Recentemente";

                return {
                  id: testimonial.id,
                  name: name,
                  gender: isGirlName ? "girl" : "boy",
                  rating:
                    testimonial.attributes?.nota ||
                    testimonial.attributes?.rating ||
                    testimonial.nota ||
                    testimonial.rating ||
                    5,
                  comment:
                    testimonial.attributes?.descricao ||
                    testimonial.attributes?.comentario ||
                    testimonial.descricao ||
                    testimonial.comentario ||
                    "",
                  date: date,
                };
              }
            );

            return testimonials;
          }
        }
      } catch {
        continue;
      }
    }

    // If no testimonials endpoint is found or all are empty, return empty array
    return [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "Há 1 dia";
  } else if (diffDays < 7) {
    return `Há ${diffDays} dias`;
  } else if (diffDays < 14) {
    return "Há 1 semana";
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Há ${weeks} semanas`;
  } else if (diffDays < 60) {
    return "Há 1 mês";
  } else {
    const months = Math.floor(diffDays / 30);
    return `Há ${months} meses`;
  }
}

// Returns total count of schools (content-type: escola)
export async function fetchSchoolsCount(): Promise<number> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/escolas?pagination[page]=1&pagination[pageSize]=1&locale=pt-BR`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch schools count");
    }
    const json = await response.json();
    // Strapi v4 returns a meta.pagination.total with the total count
    const total = json?.meta?.pagination?.total ?? 0;
    return typeof total === "number" ? total : 0;
  } catch (e) {
    console.error("Error fetching schools count", e);
    return 0;
  }
}

// Returns total count of students (content-type: aluno)
// Uses internal API route that handles authentication
export async function fetchStudentsCount(): Promise<number> {
  try {
    // No servidor, fetch requer URL absoluta
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : "";
    const url = `${baseUrl}/api/stats/students-count`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch students count");
    }
    const json = await response.json();
    return json?.count ?? 0;
  } catch (e) {
    console.error("Error fetching students count", e);
    return 0;
  }
}

export async function fetchMentorsCount(): Promise<number> {
  try {
    // No servidor, fetch requer URL absoluta
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : "";
    const url = `${baseUrl}/api/stats/mentors-count`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch mentors count");
    }
    const json = await response.json();
    return json?.count ?? 0;
  } catch (e) {
    console.error("Error fetching mentors count", e);
    return 0;
  }
}

export async function fetchCoursesCount(): Promise<number> {
  try {
    // No servidor, fetch requer URL absoluta
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : "";
    const url = `${baseUrl}/api/stats/courses-count`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch courses count");
    }
    const json = await response.json();
    return json?.count ?? 0;
  } catch (e) {
    console.error("Error fetching courses count", e);
    return 0;
  }
}

export interface TrilhaWithCount {
  id: number;
  nome: string;
  descricao: string;
  courseCount: number;
  cursoIds?: number[];
}

export async function fetchTrilhasWithCourseCount(): Promise<
  TrilhaWithCount[]
> {
  try {
    // Buscar trilhas com seus cursos relacionados
    const trilhasResponse = await fetch(
      `${STRAPI_API_URL}/api/trilhas?populate[cursos][filters][habilitado][$eq]=true&publicationState=preview&locale=pt-BR`,
      { next: { revalidate: 60 } }
    );

    if (!trilhasResponse.ok) {
      throw new Error("Failed to fetch trilhas");
    }

    const trilhasData = await trilhasResponse.json();
    const trilhas = trilhasData?.data || [];
    // Processar trilhas e contar cursos relacionados
    const trilhasWithCount: TrilhaWithCount[] = trilhas.map((trilha: any) => {
      return {
        id: trilha.id,
        nome: trilha.nome || "",
        descricao: trilha.descricao || "",
        courseCount: trilha.cursos?.length || 0,
        cursoIds: trilha.cursos?.map((curso: any) => curso.id) || [],
      };
    });

    return trilhasWithCount;
  } catch (e) {
    console.error("Error fetching trilhas with course count", e);
    // Fallback para dados mockados
    return [
      {
        id: 1,
        nome: "Criatividade e Bem-Estar",
        descricao:
          "Desenvolva sua criatividade e aprenda a cuidar do seu bem-estar físico e mental",
        courseCount: 12,
      },
      {
        id: 2,
        nome: "Tecnologia",
        descricao:
          "Domine as ferramentas digitais e aprenda a criar soluções tecnológicas inovadoras",
        courseCount: 15,
      },
      {
        id: 3,
        nome: "Negócios",
        descricao:
          "Entenda como funcionam os negócios e desenvolva uma mentalidade empreendedora",
        courseCount: 10,
      },
      {
        id: 4,
        nome: "Liderança",
        descricao:
          "Aprenda a liderar equipes e projetos com inteligência emocional e visão estratégica",
        courseCount: 8,
      },
    ];
  }
}

// Fetch the first upcoming campaign: inscricao_iniciada = false/null AND aulas_iniciadas = false/null
export async function fetchCurrentCampaign(): Promise<{
  periodo_inscricao?: string | null;
  inicio_e_fim_aulas?: string | null;
} | null> {
  try {
    // Get a small batch and filter client-side to be robust to filter quirks
    const url = `${STRAPI_API_URL}/api/campanhas?pagination[page]=1&pagination[pageSize]=10&sort[0]=createdAt:asc&publicationState=preview&locale=pt-BR`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(`Failed to fetch campaign: ${response.status}`);
    }
    const json = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list: any[] = Array.isArray(json?.data) ? json.data : [];
    const found = list.find((item) => {
      const a = item?.attributes || item || {};
      const inscricaoOk =
        a.inscricao_iniciada === false || a.inscricao_iniciada == null;
      const aulasOk = a.aulas_iniciadas === false || a.aulas_iniciadas == null;
      return inscricaoOk && aulasOk;
    });
    if (!found) return null;
    const attr = found.attributes || found;
    return {
      periodo_inscricao:
        attr.periodo_inscricao ??
        attr.periodoDeInscricao ??
        attr.periodo ??
        null,
      inicio_e_fim_aulas:
        attr.inicio_e_fim_aulas ?? attr.inicioFimAulas ?? null,
    };
  } catch (e) {
    console.error("Error fetching current campaign", e);
    return null;
  }
}

export interface Student {
  id?: number;
  documentId?: string;
  nome: string;
  data_nascimento: string;
  cpf_aluno: string;
  responsavel: string;
  email_responsavel: string;
  cpf_responsavel: string;
  telefone_responsavel: string;
  pais: string;
  estado: string;
  cidade: string;
  telefone_aluno?: string;
  portador_deficiencia?: boolean;
  descricao_deficiencia?: string;
  escola_parceira?: string;
  cursos: Array<{
    id: number;
    documentId: string;
  }>;
  turma: number;
  publishedAt?: string;
  usou_voucher?: boolean;
}

export async function findStudentByCPF(cpf: string): Promise<Student | null> {
  try {
    // Remover formatação do CPF (pontos, traços, espaços)
    const cleanCPF = cpf.replace(/\D/g, "");

    if (!cleanCPF || cleanCPF.length !== 11) {
      console.error("CPF inválido:", cpf);
      return null;
    }

    const url = `${STRAPI_API_URL}/api/alunos?filters[cpf_aluno][$eq]=${cleanCPF}&filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=documentId&publicationState=preview`;

    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    // Preparar headers com autenticação
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (ADMIN_TOKEN) {
      headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Erro na resposta da API:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch student");
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return null;
    }

    const aluno = data.data[0];
    const attributes = aluno?.attributes ?? aluno; // Suporta formatos com e sem 'attributes'
    const cursosRaw = attributes?.cursos?.data ?? attributes?.cursos ?? [];

    // Mapear para a interface Student de forma resiliente
    const student: Student = {
      id: aluno.id,
      documentId: aluno.documentId ?? attributes?.documentId ?? "",
      nome: attributes?.nome ?? "",
      data_nascimento: attributes?.data_nascimento ?? "",
      cpf_aluno: attributes?.cpf_aluno ?? "",
      responsavel: attributes?.responsavel ?? "",
      email_responsavel: attributes?.email_responsavel ?? "",
      cpf_responsavel: attributes?.cpf_responsavel ?? "",
      telefone_responsavel: attributes?.telefone_responsavel ?? "",
      pais: attributes?.pais ?? "",
      estado: attributes?.estado ?? "",
      cidade: attributes?.cidade ?? "",
      telefone_aluno: attributes?.telefone_aluno ?? "",
      portador_deficiencia: attributes?.portador_deficiencia ?? false,
      descricao_deficiencia: attributes?.descricao_deficiencia ?? "",
      escola_parceira: attributes?.escola_parceira ?? "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cursos: (Array.isArray(cursosRaw) ? cursosRaw : []).map((curso: any) => ({
        id: curso?.id,
        documentId: curso?.documentId ?? curso?.attributes?.documentId ?? "",
      })),
      turma: attributes?.turma ?? 0,
      publishedAt: attributes?.publishedAt ?? "",
      usou_voucher: attributes?.usou_voucher ?? false,
    };

    return student;
  } catch (error) {
    console.error("Error finding student:", error);
    return null;
  }
}

export async function updateStudentCourses(
  studentId: number,
  courseId: number,
  documentId: string,
  usedVoucher: boolean = false,
  portadorDeficiencia?: boolean,
  descricaoDeficiencia?: string
): Promise<void> {
  try {
    const updateData: {
      cursos: { set: Array<{ id: number }> };
      usou_voucher?: boolean;
      portador_deficiencia?: boolean;
      descricao_deficiencia?: string;
      publishedAt?: string;
    } = {
      // Replace entire relation to ensure ONLY the new course remains
      cursos: {
        set: [{ id: courseId }],
      },
      // Force publish so published matches draft
      publishedAt: new Date().toISOString(),
    };

    if (usedVoucher) {
      updateData.usou_voucher = true;
    }

    if (portadorDeficiencia !== undefined) {
      updateData.portador_deficiencia = portadorDeficiencia;
    }

    if (descricaoDeficiencia !== undefined) {
      updateData.descricao_deficiencia = descricaoDeficiencia;
    }

    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    // Preparar headers com autenticação
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (ADMIN_TOKEN) {
      headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
    }

    const response = await fetch(`${STRAPI_API_URL}/api/alunos/${documentId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        data: updateData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update student courses");
    }
  } catch (error) {
    console.error("Error updating student courses:", error);
    throw error;
  }
}

export async function createStudent(
  student: Omit<Student, "id">
): Promise<Student> {
  // Limpar formatação do CPF antes de processar
  const cleanCPF = student.cpf_aluno.replace(/\D/g, "");
  const cleanCPFResponsavel = student.cpf_responsavel?.replace(/\D/g, "") || "";

  const existingStudent = await findStudentByCPF(cleanCPF);
  // Verificar se o cupom é gratuito baseado no campo usou_voucher do aluno
  // O campo usou_voucher já é definido no EnrollmentModal baseado no voucher_gratuito do cupom
  const isVoucherGratuito = student.usou_voucher;

  if (existingStudent) {
    await updateStudentCourses(
      existingStudent.id!,
      parseInt(student.cursos[0].id.toString()),
      existingStudent.documentId!,
      isVoucherGratuito,
      student.portador_deficiencia,
      student.descricao_deficiencia
    );
    return existingStudent;
  }

  const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

  const payload = {
    data: {
      nome: student.nome,
      data_nascimento: student.data_nascimento,
      cpf_aluno: cleanCPF, // Usar CPF sem formatação
      responsavel: student.responsavel,
      email_responsavel: student.email_responsavel,
      cpf_responsavel: cleanCPFResponsavel || undefined, // Usar CPF sem formatação
      telefone_responsavel: student.telefone_responsavel,
      pais: student.pais,
      estado: student.estado,
      cidade: student.cidade,
      telefone_aluno: student.telefone_aluno,
      portador_deficiencia: student.portador_deficiencia,
      descricao_deficiencia: student.descricao_deficiencia,
      cursos: student.cursos.map((course) => ({
        id: course.id,
      })),
      escola_parceira: student.escola_parceira,
      turma: student.turma,
      usou_voucher: isVoucherGratuito, // Usar a verificação baseada no cupom ou no campo do aluno
    },
  };

  // Preparar headers com autenticação
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (ADMIN_TOKEN) {
    headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Strapi Error:", errorData);
    throw new Error("Failed to create student");
  }

  return response.json();
}

export async function fetchSchools() {
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/escolas?populate=*`);

    if (!response.ok) {
      throw new Error("Failed to fetch schools");
    }

    const data = await response.json();
    return data.data.map((school: { id: number; nome: string }) => ({
      id: school.id.toString(),
      nome: school.nome,
    }));
  } catch (error) {
    console.error("Error fetching schools:", error);
    return [];
  }
}

export async function fetchSchoolsWithLogo(): Promise<Escola[]> {
  try {
    const url = `${STRAPI_API_URL}/api/escolas?populate=*`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch schools with logo: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Filter schools with cliente=true on the client side
    const schoolsWithCliente =
      data.data?.filter((school: Escola) => school.cliente === true) || [];

    return schoolsWithCliente;
  } catch (error) {
    console.error("Error fetching schools with logo:", error);
    return [];
  }
}

export async function fetchPartnerSchools(): Promise<PartnerSchool[]> {
  try {
    const url = `${STRAPI_API_URL}/api/escolas?populate=*`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch partner schools: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Filter schools with cliente=true and transform to PartnerSchool format
    const partnerSchools: PartnerSchool[] =
      data.data
        ?.filter((school: any) => {
          const schoolData = school.attributes || school;
          return schoolData.cliente === true;
        })
        ?.map((school: any) => {
          const schoolData = school.attributes || school;
          // Handle Strapi image structure (can be data.attributes.url or url directly)
          let logoUrl = "";
          if (schoolData.logo) {
            if (schoolData.logo.data?.attributes?.url) {
              logoUrl = schoolData.logo.data.attributes.url;
            } else if (schoolData.logo.attributes?.url) {
              logoUrl = schoolData.logo.attributes.url;
            } else if (schoolData.logo.url) {
              logoUrl = schoolData.logo.url;
            }
          }
          return {
            id: schoolData.id || school.id,
            documentId: schoolData.documentId || school.documentId,
            name: schoolData.nome || "",
            logo: logoUrl,
          };
        }) || [];

    return partnerSchools;
  } catch (error) {
    console.error("Error fetching partner schools:", error);
    return [];
  }
}

export async function fetchAllStudents(): Promise<Student[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&fields[0]=turma&publicationState=preview`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

export function getStudentsByCourseAndClass(
  students: Student[],
  courseId: number,
  classNumber: string
): Student[] {
  const studentsInCourse = students.filter((student) =>
    student.cursos?.some((course) => course.id === courseId)
  );
  const studentsInClass = studentsInCourse.filter(
    (student) => student.turma === parseInt(classNumber)
  );
  return studentsInClass;
}

export interface Suggestion {
  dias_da_semana: Array<{ dia_da_semana: string }>;
  horario: string;
  comentario?: string;
  curso: number;
}

export async function createSuggestion(suggestion: Suggestion): Promise<void> {
  const payload = {
    data: {
      dias_da_semana: suggestion.dias_da_semana.map((dia) => ({
        dia_da_semana: dia.dia_da_semana,
      })),
      horario: suggestion.horario,
      comentario: suggestion.comentario || "",
      curso: {
        connect: [{ id: suggestion.curso }],
      },
    },
  };

  try {
    const response = await fetch(`${STRAPI_API_URL}/api/sugestoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi Error Response:", errorData);
      throw new Error("Failed to create suggestion");
    }
    return response.json();
  } catch (error) {
    console.error("Error creating suggestion:", error);
    throw error;
  }
}

export interface CourseStudentsCount {
  courseId: number;
  courseTitle: string;
  studentCount: number;
}

export async function getStudentsPerCourse(): Promise<CourseStudentsCount[]> {
  try {
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    // Preparar headers com autenticação
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (ADMIN_TOKEN) {
      headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
    }

    // Fetch all courses to get their titles
    const coursesUrl = `${STRAPI_API_URL}/api/cursos?filters[habilitado][$eq]=true&fields[0]=id&fields[1]=titulo&locale=pt-BR&pagination[pageSize]=1000`;
    const coursesResponse = await fetch(coursesUrl, {
      headers,
      next: { revalidate: 60 },
    });

    if (!coursesResponse.ok) {
      console.error(
        `Failed to fetch courses: ${coursesResponse.status} ${coursesResponse.statusText}`
      );
      throw new Error("Failed to fetch courses");
    }

    const coursesData = await coursesResponse.json();
    const coursesRaw = coursesData.data || [];

    // Fetch all students with their courses
    const studentsUrl = `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=titulo&publicationState=preview&pagination[pageSize]=1000`;
    const studentsResponse = await fetch(studentsUrl, {
      headers,
      next: { revalidate: 60 },
    });

    if (!studentsResponse.ok) {
      console.error(
        `Failed to fetch students: ${studentsResponse.status} ${studentsResponse.statusText}`
      );
      throw new Error("Failed to fetch students");
    }

    const studentsData = await studentsResponse.json();
    const students = studentsData.data || [];

    // Create a map to store student counts for each course
    const courseStudentCounts = new Map<number, CourseStudentsCount>();

    // Initialize counts for each course
    coursesRaw.forEach((course: any) => {
      // Normalizar estrutura do curso (pode vir com ou sem attributes)
      const courseData = course.attributes || course;
      const courseId = courseData.id || course.id;
      const courseTitle = courseData.titulo || "";

      if (courseId) {
        const normalizedId =
          typeof courseId === "number"
            ? courseId
            : parseInt(String(courseId), 10);
        if (!isNaN(normalizedId)) {
          courseStudentCounts.set(normalizedId, {
            courseId: normalizedId,
            courseTitle,
            studentCount: 0,
          });
        }
      }
    });

    // Count students in each course
    students.forEach((student: any) => {
      // Normalizar estrutura do aluno
      const studentData = student.attributes || student;
      const cursosRaw = studentData.cursos || [];

      // Normalizar cursos (pode vir como array ou objeto com data)
      const cursosArray = Array.isArray(cursosRaw)
        ? cursosRaw
        : cursosRaw.data || [];

      cursosArray.forEach((course: any) => {
        // Normalizar estrutura do curso
        const courseId =
          course.id ||
          course.attributes?.id ||
          (typeof course === "number" ? course : null);

        if (courseId) {
          const courseStats = courseStudentCounts.get(courseId);
          if (courseStats) {
            courseStats.studentCount++;
          }
        }
      });
    });

    // Convert map to array e filtrar apenas cursos com alunos
    return Array.from(courseStudentCounts.values()).filter(
      (course) => course.studentCount > 0
    );
  } catch (error) {
    console.error("Error fetching course student counts:", error);
    return [];
  }
}

export interface FAQ {
  id: number;
  documentId: string;
  pergunta: string;
  resposta: string;
  ordem?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export async function fetchFAQs(locale: string = "pt-BR"): Promise<FAQ[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/perguntas-frequentes?locale=${locale}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch FAQs");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export interface AlunoStrapi {
  id: number;
  nome?: string;
  cpf_aluno?: string;
  email_responsavel?: string;
  telefone_aluno?: string;
  data_nascimento?: string;
  escola_parceira?: string;
  habilitado?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlunoParceiro {
  id: number;
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  escola?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentsReportData {
  alunos: Array<{
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  totalAlunosStrapi: number;
  totalAlunosParceiros: number;
}

export async function fetchAllAlunosStrapi(): Promise<AlunoStrapi[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos?populate=*&pagination[pageSize]=1000`
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`Failed to fetch alunos from Strapi: ${response.status}`);
    }

    const data = await response.json();

    // Filtrar apenas alunos habilitados
    const alunosHabilitados =
      data.data?.filter(
        (aluno: { habilitado?: boolean }) => aluno.habilitado === true
      ) || [];

    return alunosHabilitados;
  } catch (error) {
    console.error("Error fetching alunos from Strapi:", error);
    throw error; // Re-throw para que o erro seja tratado na função principal
  }
}

export async function fetchAllAlunosParceiros(): Promise<AlunoParceiro[]> {
  try {
    // Buscar todos os registros, incluindo não publicados, sem limite de paginação
    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos-escola-parceira?populate=*&publicationState=preview&pagination[pageSize]=1000`
    );

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      // Se não conseguir buscar alunos parceiros, retorna array vazio
      // para que o relatório ainda funcione mostrando todos os alunos do Strapi
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching alunos parceiros:", error);
    // Em caso de erro, retorna array vazio para não quebrar o relatório
    return [];
  }
}

export async function generateStudentsReport(): Promise<StudentsReportData> {
  try {
    // Buscar alunos do Strapi primeiro
    let alunos: AlunoStrapi[] = [];
    try {
      alunos = await fetchAllAlunosStrapi();
    } catch (error) {
      console.error("Error fetching alunos from Strapi:", error);
      // Se não conseguir buscar alunos do Strapi, retorna relatório vazio
      return {
        alunos: [],
        total: 0,
        totalAlunosStrapi: 0,
        totalAlunosParceiros: 0,
      };
    }

    // Buscar alunos parceiros (pode falhar sem quebrar o relatório)
    let alunosParceiros: AlunoParceiro[] = [];
    try {
      alunosParceiros = await fetchAllAlunosParceiros();
    } catch (error) {
      console.error("Error fetching alunos parceiros:", error);
      // Se não conseguir buscar alunos parceiros, considera lista vazia
      alunosParceiros = [];
    }

    // Criar um Set com os nomes normalizados dos alunos parceiros para busca mais eficiente
    const nomesAlunosParceiros = new Set(
      alunosParceiros
        .map((aluno) => {
          const nome = aluno.nome;
          return nome ? normalizeName(nome) : null;
        })
        .filter(Boolean)
    );

    // Filtrar alunos que existem no Strapi mas não estão na lista de parceiros
    const alunosNaoParceiros = alunos.filter((aluno) => {
      const nomeAluno = aluno.nome;
      if (!nomeAluno) return true; // Se não tem nome, considera como não parceiro

      const nomeNormalizado = normalizeName(nomeAluno);
      const isNotPartner = !nomesAlunosParceiros.has(nomeNormalizado);

      return isNotPartner;
    });

    // Formatar os dados para retorno
    const alunosFormatados = alunosNaoParceiros.map((aluno) => ({
      id: aluno.id,
      nome: aluno.nome || "",
      cpf: aluno.cpf_aluno || "",
      email: aluno.email_responsavel || "",
      telefone: aluno.telefone_aluno || "",
      dataNascimento: aluno.data_nascimento || "",
      createdAt: aluno.createdAt || "",
      updatedAt: aluno.updatedAt || "",
    }));

    return {
      alunos: alunosFormatados,
      total: alunosFormatados.length,
      totalAlunosStrapi: alunos.length,
      totalAlunosParceiros: alunosParceiros.length,
    };
  } catch (error) {
    console.error("Error generating students report:", error);
    // Retorna relatório vazio em caso de erro geral
    return {
      alunos: [],
      total: 0,
      totalAlunosStrapi: 0,
      totalAlunosParceiros: 0,
    };
  }
}

export async function updateCourse(
  documentId: string,
  courseData: {
    titulo?: string;
    descricao?: string;
    nivel?: string;
    modelo?: string;
    pre_requisitos?: string;
    projetos?: string;
    tarefa_de_casa?: string;
    competencias?: string;
    inscricoes_abertas?: boolean;
    habilitado?: boolean;
    data_inicio_curso?: string | null;
    sugestao_horario?: boolean;
    videos?: Array<{
      titulo: string;
      video_url: string;
    }>;
    cronograma?: Array<{
      data_inicio?: string;
      data_fim?: string;
      dia_semana?: string;
      horario_aula?: string;
    }>;
    ementa_resumida?: Array<{
      descricao: string;
    }>;
    resumo_aulas?: Array<{
      nome_aula: string;
      descricao_aula: string;
    }>;
  }
): Promise<void> {
  try {
    // Remove faixa_etaria from cronograma items as it's no longer part of the schema
    const removeFaixaEtariaFromCronograma = (cronograma: unknown): unknown => {
      if (!Array.isArray(cronograma)) {
        return cronograma;
      }
      return cronograma.map((item) => {
        if (item && typeof item === "object") {
          const rest: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(
            item as Record<string, unknown>
          )) {
            if (key !== "faixa_etaria") {
              rest[key] = value;
            }
          }
          return rest;
        }
        return item;
      });
    };

    const findResponse = await fetch(
      `${STRAPI_API_URL}/api/cursos?filters[documentId][$eq]=${documentId}&locale=pt-BR&populate=*`,
      {
        headers: buildStrapiAuthHeaders(),
        cache: "no-store",
      }
    );

    if (!findResponse.ok) {
      throw new Error(`Failed to find course: ${findResponse.statusText}`);
    }

    const findData = await findResponse.json();

    if (!findData.data || findData.data.length === 0) {
      throw new Error("Course not found");
    }

    const course = findData.data[0];
    const currentData = course.attributes || course;

    const cleanData = cleanDataRecursively(currentData) as Record<
      string,
      unknown
    >;

    if (cleanData.cronograma) {
      cleanData.cronograma = cleanDataRecursively(
        removeFaixaEtariaFromCronograma(cleanData.cronograma)
      );
    }

    const assignIfDefined = (key: string, value: unknown) => {
      if (value !== undefined) {
        cleanData[key] = value;
      }
    };

    assignIfDefined("titulo", courseData.titulo);
    assignIfDefined("descricao", courseData.descricao);
    assignIfDefined("nivel", courseData.nivel);
    assignIfDefined("modelo", courseData.modelo);
    assignIfDefined("pre_requisitos", courseData.pre_requisitos);
    assignIfDefined("projetos", courseData.projetos);
    assignIfDefined("tarefa_de_casa", courseData.tarefa_de_casa);
    assignIfDefined("competencias", courseData.competencias);
    assignIfDefined("inscricoes_abertas", courseData.inscricoes_abertas);
    assignIfDefined("habilitado", courseData.habilitado);
    if (courseData.data_inicio_curso !== undefined) {
      assignIfDefined("data_inicio_curso", courseData.data_inicio_curso);
    }
    assignIfDefined("sugestao_horario", courseData.sugestao_horario);
    assignIfDefined("videos", courseData.videos);
    if (courseData.cronograma !== undefined) {
      cleanData.cronograma = cleanDataRecursively(
        removeFaixaEtariaFromCronograma(courseData.cronograma)
      );
    }
    if (courseData.ementa_resumida !== undefined) {
      cleanData.ementa_resumida = cleanDataRecursively(
        courseData.ementa_resumida
      );
    }
    if (courseData.resumo_aulas !== undefined) {
      cleanData.resumo_aulas = cleanDataRecursively(courseData.resumo_aulas);
    }

    if (currentData.imagem && typeof currentData.imagem === "object") {
      const imagem = currentData.imagem as { id?: number };
      if (imagem.id) {
        cleanData.imagem = imagem.id;
      }
    }

    const requestBody = { data: cleanData };

    const response = await fetch(
      `${STRAPI_API_URL}/api/cursos/${documentId}?locale=pt-BR`,
      {
        method: "PUT",
        headers: buildStrapiAuthHeaders(),
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update course: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}

export async function updateMentor(
  mentorRef: { id?: number | null; documentId?: string | null },
  mentorData: {
    nome?: string;
    descricao?: string;
    pais?: string;
    instagram?: string;
    instagram_label?: string;
    linkedin_url?: string;
    linkedin_label?: string;
    imagem?: number | null;
  }
): Promise<void> {
  try {
    const headers = buildStrapiAuthHeaders();
    if (
      !headers ||
      (typeof headers === "object" && !("Authorization" in headers))
    ) {
      throw new Error("STRAPI_TOKEN não configurado para atualizar mentor");
    }

    const fetchMentorById = async (id: number) =>
      fetch(
        `${STRAPI_API_URL}/api/mentores/${id}?locale=pt-BR&populate=imagem`,
        {
          headers,
          cache: "no-store",
        }
      );

    const fetchMentorByDocumentId = async (documentId: string) =>
      fetch(
        `${STRAPI_API_URL}/api/mentores?filters[documentId][$eq]=${documentId}&locale=pt-BR&populate=imagem`,
        {
          headers,
          cache: "no-store",
        }
      );

    let mentorIdToUse: number | null =
      typeof mentorRef.id === "number" && !Number.isNaN(mentorRef.id)
        ? mentorRef.id
        : null;
    let mentorDocumentId: string | null = mentorRef.documentId ?? null;

    let mentorPayload: {
      id?: number;
      documentId?: string;
      attributes?: any;
    } | null = null;

    if (mentorDocumentId) {
      const byDocumentResponse = await fetchMentorByDocumentId(
        mentorDocumentId
      );
      if (byDocumentResponse.ok) {
        const responseJson = await byDocumentResponse.json();
        mentorPayload = Array.isArray(responseJson.data)
          ? responseJson.data[0]
          : responseJson.data;
      }
    }

    if (!mentorPayload && mentorIdToUse !== null) {
      const byIdResponse = await fetchMentorById(mentorIdToUse);
      if (byIdResponse.ok) {
        const responseJson = await byIdResponse.json();
        mentorPayload = responseJson.data || null;
      } else {
        mentorIdToUse = null;
      }
    }

    if (!mentorPayload) {
      throw new Error("Mentor not found");
    }

    if (!mentorIdToUse) {
      const parsedId =
        typeof mentorPayload.id === "number"
          ? mentorPayload.id
          : mentorPayload.id != null
          ? parseInt(String(mentorPayload.id), 10)
          : null;
      mentorIdToUse = parsedId && !Number.isNaN(parsedId) ? parsedId : null;
    }

    mentorDocumentId =
      mentorDocumentId ||
      mentorPayload.documentId ||
      mentorPayload.attributes?.documentId ||
      null;

    if (!mentorDocumentId) {
      throw new Error("Mentor documentId not available");
    }

    const mentor = mentorPayload;

    const currentData = mentor.attributes || mentor;
    const cleanData = cleanDataRecursively(currentData) as Record<
      string,
      unknown
    >;

    for (const [key, value] of Object.entries(mentorData)) {
      if (value !== undefined) {
        cleanData[key] = value;
      }
    }

    if (!("imagem" in mentorData)) {
      const currentImageId =
        currentData.imagem?.data?.id ?? currentData.imagem?.id ?? null;
      if (currentImageId) {
        cleanData.imagem = currentImageId;
      }
    } else if (mentorData.imagem === null) {
      cleanData.imagem = null;
    }

    const response = await fetch(
      `${STRAPI_API_URL}/api/mentores/${mentorDocumentId}?locale=pt-BR`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ data: cleanData }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update mentor: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error updating mentor:", error);
    throw error;
  }
}

// Interface para dados de matrícula por escola
export interface EnrollmentBySchool {
  school: string;
  enrolled: number;
  notEnrolled: number;
}

// Função para buscar matrículas por escola
export async function fetchEnrollmentBySchool(): Promise<EnrollmentBySchool[]> {
  try {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : "";

    // Buscar todos os alunos habilitados com seus cursos e escola_parceira
    const url = `${baseUrl}/api/admin/all-students`;
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status}`);
    }

    const data = await response.json();
    const students = data.data || [];

    // Agrupar alunos por escola_parceira
    const schoolMap = new Map<
      string,
      { enrolled: number; notEnrolled: number }
    >();

    students.forEach((student: any) => {
      const escola = student.escola_parceira || "Sem escola";
      const hasCourses =
        student.cursos &&
        Array.isArray(student.cursos) &&
        student.cursos.length > 0;

      if (!schoolMap.has(escola)) {
        schoolMap.set(escola, { enrolled: 0, notEnrolled: 0 });
      }

      const stats = schoolMap.get(escola)!;
      if (hasCourses) {
        stats.enrolled++;
      } else {
        stats.notEnrolled++;
      }
    });

    // Converter para array e ordenar por total de alunos
    const result: EnrollmentBySchool[] = Array.from(schoolMap.entries())
      .map(([school, stats]) => ({
        school,
        enrolled: stats.enrolled,
        notEnrolled: stats.notEnrolled,
      }))
      .sort((a, b) => b.enrolled + b.notEnrolled - (a.enrolled + a.notEnrolled))
      .slice(0, 10); // Top 10 escolas

    return result;
  } catch (error) {
    console.error("Error fetching enrollment by school:", error);
    return [];
  }
}

// Interface para evolução de matrículas
export interface EnrollmentTrend {
  month: string;
  matriculas: number;
}

// Função para buscar evolução de matrículas ao longo do tempo
export async function fetchEnrollmentTrend(
  locale: string = "pt-BR"
): Promise<EnrollmentTrend[]> {
  try {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : "";

    // Buscar todos os alunos habilitados com createdAt
    const url = `${baseUrl}/api/admin/all-students`;
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status}`);
    }

    const data = await response.json();
    const students = data.data || [];

    // Definir nomes de meses baseados no locale
    const isEnglish = locale === "en" || locale === "en-US";
    const monthNames = isEnglish
      ? [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      : [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];

    // Agrupar por mês usando createdAt
    const monthMap = new Map<string, number>();

    students.forEach((student: any) => {
      if (student.createdAt) {
        const date = new Date(student.createdAt);
        // Usar índice do mês (0-11) para garantir consistência
        const monthIndex = date.getMonth();
        const monthKey = monthNames[monthIndex];
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
      }
    });

    // Ordenar por data (mais antigo primeiro) e pegar últimos 7 meses
    const sortedEntries = Array.from(monthMap.entries())
      .sort((a, b) => {
        const aIndex = monthNames.indexOf(a[0]);
        const bIndex = monthNames.indexOf(b[0]);
        return aIndex - bIndex;
      })
      .slice(-7); // Últimos 7 meses

    const result: EnrollmentTrend[] = sortedEntries.map(([month, count]) => ({
      month,
      matriculas: count,
    }));

    return result.length > 0 ? result : [];
  } catch (error) {
    console.error("Error fetching enrollment trend:", error);
    return [];
  }
}

// Interface para cursos populares
export interface PopularCourse {
  name: string;
  students: number;
  color: string;
}

// Função para buscar cursos mais populares
export async function fetchPopularCourses(): Promise<PopularCourse[]> {
  try {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : "";

    // Usar rota API do Next.js que faz autenticação no servidor
    const url = `${baseUrl}/api/stats/popular-courses`;
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch popular courses: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();
    const courseCounts = data.data || [];

    if (!courseCounts || courseCounts.length === 0) {
      console.warn("No course counts found");
      return [];
    }

    // Cores para os gráficos
    const colors = [
      "#599fe9",
      "#f54a12",
      "#10b981",
      "#8b5cf6",
      "#f59e0b",
      "#ec4899",
    ];

    return courseCounts.map((course: any, index: number) => ({
      name: course.courseTitle || "Curso sem nome",
      students: course.studentCount,
      color: colors[index % colors.length],
    }));
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    return [];
  }
}
