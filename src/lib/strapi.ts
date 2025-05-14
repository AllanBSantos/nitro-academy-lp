import { Course, Mentor, Review } from "@/types/strapi";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
export async function fetchCourses(
  locale: string = "pt-BR"
): Promise<Course[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/cursos?fields[0]=id&fields[1]=titulo&fields[2]=descricao&fields[3]=nota&fields[4]=nivel&fields[5]=modelo&fields[6]=objetivo&fields[7]=pre_requisitos&fields[8]=projetos&fields[9]=tarefa_de_casa&fields[10]=preco&fields[11]=parcelas&fields[12]=destaques&fields[13]=slug&fields[14]=link_pagamento&fields[15]=moeda&fields[16]=informacoes_adicionais&fields[17]=badge&fields[18]=link_desconto&fields[19]=competencias&fields[20]=ideal_para&fields[21]=sugestao_horario&populate[imagem][fields][0]=url&populate[mentor][populate][imagem][fields][0]=url&populate[mentor][fields][0]=nome&populate[mentor][fields][1]=profissao&populate[mentor][fields][2]=descricao&populate[mentor][fields][3]=nota&populate[mentor][fields][4]=avaliacoes&populate[mentor][fields][5]=alunos&populate[mentor][fields][6]=cursos&populate[mentor][fields][7]=instagram&populate[mentor][fields][8]=instagram_label&populate[videos][populate]=video&populate[tags][fields][0]=nome&populate[cronograma][fields][0]=data_fim&populate[cronograma][fields][1]=data_inicio&populate[cronograma][fields][2]=dia&populate[cronograma][fields][3]=horario&populate[cronograma][fields][4]=faixa_etaria&populate[cupons][fields][0]=nome&populate[cupons][fields][1]=url&populate[cupons][fields][2]=valido&populate[cupons][fields][3]=validade&populate[cupons][fields][4]=voucher_gratuito&populate[ementa_resumida][fields][0]=descricao&populate[resumo_aulas][fields][0]=nome_aula&populate[resumo_aulas][fields][1]=descricao_aula&locale=${locale}&_=${Date.now()}`
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

export interface Student {
  id?: number;
  documentId?: string;
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
  escola_parceira?: string;
  cursos: Array<{
    id: number;
    documentId: string;
  }>;
  turma: number;
  publishedAt?: string;
}

export async function createStudent(
  student: Omit<Student, "id">
): Promise<Student> {
  const payload = {
    data: {
      nome: student.nome,
      data_nascimento: student.data_nascimento,
      responsavel: student.responsavel,
      email_responsavel: student.email_responsavel,
      cpf_responsavel: student.cpf_responsavel,
      telefone_responsavel: student.telefone_responsavel,
      pais: student.pais,
      estado: student.estado,
      cidade: student.cidade,
      telefone_aluno: student.telefone_aluno,
      cursos: student.cursos.map((course) => ({
        id: course.id,
      })),
      escola_parceira: student.escola_parceira,
      turma: student.turma,
    },
  };

  console.log("Payload:", JSON.stringify(payload, null, 2));

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

export async function fetchAllStudents(): Promise<Student[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos?populate[cursos][fields][0]=id&fields[0]=turma`
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
  console.log("Suggestion data being sent:", {
    dias_da_semana: suggestion.dias_da_semana,
    horario: suggestion.horario,
    comentario: suggestion.comentario,
    curso: suggestion.curso,
  });

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

  console.log(
    "Full payload being sent to Strapi:",
    JSON.stringify(payload, null, 2)
  );

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

    const responseData = await response.json();
    console.log("Strapi Success Response:", responseData);
  } catch (error) {
    console.error("Error creating suggestion:", error);
    throw error;
  }
}
