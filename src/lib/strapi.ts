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
import {
  COURSE_QUERY_ADMIN_PARAMS,
  COURSE_QUERY_PUBLIC_PARAMS,
} from "@/lib/strapiCourseQuery";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
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
      scope === "admin" ? COURSE_QUERY_ADMIN_PARAMS : COURSE_QUERY_PUBLIC_PARAMS;

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
    name: string;
    campaign: string;
    enrolled: number;
    available: number;
    total: number;
  }>
> {
  try {
    // Usar a função existente fetchCourses
    const courses = await fetchCourses();

    return courses.map((course: any) => {
      const enrolled = course.alunos?.length || 0;
      const totalSlots = 50; // Valor padrão, pode ser ajustado conforme necessário
      const available = Math.max(0, totalSlots - enrolled);

      // Usar a campanha real do Strapi ou fallback para data de início
      let campaign = "2024.1"; // Valor padrão

      if (course.campanhas && course.campanhas.length > 0) {
        // Usar o nome da primeira campanha encontrada
        campaign = course.campanhas[0].nome || campaign;
      } else if (course.cronograma?.[0]?.data_inicio) {
        // Fallback para data de início se não houver campanha
        const startDate = course.cronograma[0].data_inicio;
        const date = new Date(startDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        campaign = `${year}.${month <= 6 ? 1 : 2}`;
      }

      return {
        id: course.id.toString(),
        name: course.titulo,
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
    if (!cpf || cpf.length !== 11) {
      console.error("CPF inválido:", cpf);
      return null;
    }

    const url = `${STRAPI_API_URL}/api/alunos?filters[cpf_aluno][$eq]=${cpf}&filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=documentId&publicationState=preview`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
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

    const response = await fetch(`${STRAPI_API_URL}/api/alunos/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
  const existingStudent = await findStudentByCPF(student.cpf_aluno);
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

  const payload = {
    data: {
      nome: student.nome,
      data_nascimento: student.data_nascimento,
      cpf_aluno: student.cpf_aluno,
      responsavel: student.responsavel,
      email_responsavel: student.email_responsavel,
      cpf_responsavel: student.cpf_responsavel,
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/alunos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        ?.filter((school: Escola) => school.cliente === true)
        ?.map((school: Escola) => ({
          id: school.id,
          documentId: school.documentId,
          name: school.nome,
          logo: school.logo?.url || "",
        })) || [];

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

interface CourseData {
  id: number;
  attributes: {
    titulo: string;
  };
}

export async function getStudentsPerCourse(): Promise<CourseStudentsCount[]> {
  try {
    // Fetch all courses to get their titles
    const coursesResponse = await fetch(
      `${STRAPI_API_URL}/api/cursos?filters[habilitado][$eq]=true&fields[0]=id&fields[1]=titulo&locale=pt-BR`
    );

    if (!coursesResponse.ok) {
      throw new Error("Failed to fetch courses");
    }

    const coursesData = await coursesResponse.json();
    const courses = coursesData.data as CourseData[];

    // Fetch all students with their courses
    const studentsResponse = await fetch(
      `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&publicationState=preview`
    );

    if (!studentsResponse.ok) {
      throw new Error("Failed to fetch students");
    }

    const studentsData = await studentsResponse.json();
    const students = studentsData.data;

    // Create a map to store student counts for each course
    const courseStudentCounts = new Map<number, CourseStudentsCount>();

    // Initialize counts for each course
    courses.forEach((course: CourseData) => {
      courseStudentCounts.set(course.id, {
        courseId: course.id,
        courseTitle: course.attributes?.titulo || "",
        studentCount: 0,
      });
    });

    // Count students in each course
    students.forEach((student: Student) => {
      student.cursos?.forEach((course) => {
        const courseStats = courseStudentCounts.get(course.id);
        if (courseStats) {
          courseStats.studentCount++;
        }
      });
    });

    // Convert map to array
    return Array.from(courseStudentCounts.values());
  } catch (error) {
    console.error("Error fetching course student counts:", error);
    throw error;
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
      `${STRAPI_API_URL}/api/cursos?filters[documentId][$eq]=${documentId}&locale=pt-BR&populate=*`
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

    const cleanData = {
      ...(cleanDataRecursively(currentData) as Record<string, unknown>),
      titulo: courseData.titulo || currentData.titulo,
      descricao: courseData.descricao || currentData.descricao,
      nivel: courseData.nivel || currentData.nivel,
      modelo: courseData.modelo || currentData.modelo,
      pre_requisitos: courseData.pre_requisitos || currentData.pre_requisitos,
      projetos: courseData.projetos || currentData.projetos,
      tarefa_de_casa: courseData.tarefa_de_casa || currentData.tarefa_de_casa,
      competencias: courseData.competencias || currentData.competencias,
      inscricoes_abertas:
        courseData.inscricoes_abertas || currentData.inscricoes_abertas,
      videos: courseData.videos || currentData.videos,
      cronograma: cleanDataRecursively(
        removeFaixaEtariaFromCronograma(
          courseData.cronograma || currentData.cronograma
        )
      ),
      ementa_resumida: cleanDataRecursively(
        courseData.ementa_resumida || currentData.ementa_resumida
      ),
      resumo_aulas: cleanDataRecursively(
        courseData.resumo_aulas || currentData.resumo_aulas
      ),
      imagem: currentData.imagem.id,
    };

    const requestBody = { data: cleanData };

    const response = await fetch(
      `${STRAPI_API_URL}/api/cursos/${documentId}?locale=pt-BR`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
