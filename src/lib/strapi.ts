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
  cpf_aluno: string;
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
  usou_voucher?: boolean;
}

export async function findStudentByCPF(cpf: string): Promise<Student | null> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos?filters[cpf_aluno][$eq]=${cpf}&populate[cursos][fields][0]=id`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch student");
    }

    const data = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error("Error finding student:", error);
    return null;
  }
}

export async function updateStudentCourses(
  studentId: number,
  courseId: number,
  documentId: string,
  usedVoucher: boolean = false
): Promise<void> {
  try {
    const updateData: {
      cursos: { connect: Array<{ id: number }> };
      usou_voucher?: boolean;
    } = {
      cursos: {
        connect: [{ id: courseId }],
      },
    };

    if (usedVoucher) {
      updateData.usou_voucher = true;
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
  student: Omit<Student, "id">,
  couponCode?: string
): Promise<Student> {
  const existingStudent = await findStudentByCPF(student.cpf_aluno);
  const isVoucher100 = couponCode?.toLowerCase() === "voucher100";

  if (existingStudent) {
    await updateStudentCourses(
      existingStudent.id!,
      parseInt(student.cursos[0].id.toString()),
      existingStudent.documentId!,
      isVoucher100
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
      cursos: student.cursos.map((course) => ({
        id: course.id,
      })),
      escola_parceira: student.escola_parceira,
      turma: student.turma,
      usou_voucher: isVoucher100,
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
      `${STRAPI_API_URL}/api/cursos?fields[0]=id&fields[1]=titulo&locale=pt-BR`
    );

    if (!coursesResponse.ok) {
      throw new Error("Failed to fetch courses");
    }

    const coursesData = await coursesResponse.json();
    const courses = coursesData.data as CourseData[];

    // Fetch all students with their courses
    const studentsResponse = await fetch(
      `${STRAPI_API_URL}/api/alunos?populate[cursos][fields][0]=id`
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
