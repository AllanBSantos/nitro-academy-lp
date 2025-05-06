import { Course, Mentor, Review } from "@/types/strapi";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
export async function fetchCourses(
  locale: string = "pt-BR"
): Promise<Course[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/cursos?fields[0]=id&fields[1]=titulo&fields[2]=descricao&fields[3]=nota&fields[4]=nivel&fields[5]=modelo&fields[6]=objetivo&fields[7]=pre_requisitos&fields[8]=projetos&fields[9]=tarefa_de_casa&fields[10]=preco&fields[11]=parcelas&fields[12]=destaques&fields[13]=slug&fields[14]=link_pagamento&fields[15]=moeda&fields[16]=informacoes_adicionais&fields[17]=badge&fields[18]=link_desconto&populate[imagem][fields][0]=url&populate[mentor][populate][imagem][fields][0]=url&populate[mentor][fields][0]=nome&populate[mentor][fields][1]=profissao&populate[mentor][fields][2]=descricao&populate[mentor][fields][3]=nota&populate[mentor][fields][4]=avaliacoes&populate[mentor][fields][5]=alunos&populate[mentor][fields][6]=cursos&populate[mentor][fields][7]=instagram&populate[mentor][fields][8]=instagram_label&populate[videos][populate]=video&populate[tags][fields][0]=nome&populate[cronograma][fields][0]=data_fim&populate[cronograma][fields][1]=data_inicio&populate[cronograma][fields][2]=dia&populate[cronograma][fields][3]=horario&populate[cronograma][fields][4]=faixa_etaria&populate[cupons][fields][0]=nome&populate[cupons][fields][1]=url&populate[cupons][fields][2]=valido&populate[cupons][fields][3]=validade&locale=${locale}&_=${Date.now()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function fetchCourse(id: string): Promise<Course> {
  const response = await fetch(
    `${STRAPI_API_URL}/api/cursos/${id}?populate=*&locale=pt-BR`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  const { data } = await response.json();
  return data;
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

export async function createStudent(data: {
  nome: string;
  data_nascimento: string;
  responsavel: string;
  email_responsavel: string;
  cpf_responsavel: string;
  telefone_responsavel: string;
  pais: string;
  estado: string;
  cidade: string;
  telefone_aluno?: string;
  curso: number;
}) {
  try {
    const createResponse = await fetch(`${STRAPI_API_URL}/api/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          nome: data.nome,
          data_nascimento: data.data_nascimento,
          responsavel: data.responsavel,
          email_responsavel: data.email_responsavel,
          cpf_responsavel: data.cpf_responsavel,
          telefone_responsavel: data.telefone_responsavel,
          pais: data.pais,
          estado: data.estado,
          cidade: data.cidade,
          telefone_aluno: data.telefone_aluno,
          cursos: [data.curso],
          publishedAt: new Date().toISOString(),
        },
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error("Strapi error response:", errorData);
      throw new Error(`Failed to create student: ${JSON.stringify(errorData)}`);
    }

    return await createResponse.json();
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}
