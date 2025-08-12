import { Course, Mentor, Review } from "@/types/strapi";
import { normalizeName } from "@/lib/utils";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
export async function fetchCourses(
  locale: string = "pt-BR"
): Promise<Course[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/cursos?fields[0]=id&fields[1]=titulo&fields[2]=descricao&fields[3]=nota&fields[4]=nivel&fields[5]=modelo&fields[6]=pre_requisitos&fields[7]=projetos&fields[8]=tarefa_de_casa&fields[9]=preco&fields[10]=parcelas&fields[11]=slug&fields[12]=link_pagamento&fields[13]=moeda&fields[14]=informacoes_adicionais&fields[15]=badge&fields[16]=link_desconto&fields[17]=competencias&fields[18]=sugestao_horario&fields[19]=inscricoes_abertas&fields[20]=data_inicio_curso&fields[21]=lingua&fields[22]=aviso_matricula&populate[imagem][fields][0]=url&populate[mentor][populate][imagem][fields][0]=url&populate[mentor][fields][0]=nome&populate[mentor][fields][1]=profissao&populate[mentor][fields][2]=descricao&populate[mentor][fields][3]=alunos&populate[mentor][fields][4]=cursos&populate[mentor][fields][5]=instagram&populate[mentor][fields][6]=instagram_label&populate[mentor][fields][7]=pais&populate[mentor][populate][reviews]=*&populate[videos][populate]=video&populate[tags][fields][0]=nome&populate[cronograma][fields][0]=data_fim&populate[cronograma][fields][1]=data_inicio&populate[cronograma][fields][2]=faixa_etaria&populate[cronograma][fields][3]=dia_semana&populate[cronograma][fields][4]=horario_aula&populate[cronograma][fields][5]=link_aula&populate[cupons][fields][0]=nome&populate[cupons][fields][1]=url&populate[cupons][fields][2]=valido&populate[cupons][fields][3]=validade&populate[cupons][fields][4]=voucher_gratuito&populate[ementa_resumida][fields][0]=descricao&populate[resumo_aulas][fields][0]=nome_aula&populate[resumo_aulas][fields][1]=descricao_aula&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[alunos][fields][1]=turma&populate[alunos][fields][2]=documentId&populate[alunos][fields][3]=nome&populate[alunos][fields][4]=email_responsavel&populate[alunos][fields][5]=telefone_responsavel&populate[review][fields][0]=id&populate[review][fields][1]=nota&populate[review][fields][2]=descricao&populate[review][fields][3]=nome&locale=${locale}`
      /* {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      } */
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

export async function fetchCourse(documentId: string): Promise<Course> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/cursos?filters[documentId][$eq]=${documentId}&fields[0]=id&fields[1]=titulo&fields[2]=descricao&fields[3]=nota&fields[4]=nivel&fields[5]=modelo&fields[6]=pre_requisitos&fields[7]=projetos&fields[8]=tarefa_de_casa&fields[9]=preco&fields[10]=parcelas&fields[11]=slug&fields[12]=link_pagamento&fields[13]=moeda&fields[14]=informacoes_adicionais&fields[15]=badge&fields[16]=link_desconto&fields[17]=competencias&fields[18]=sugestao_horario&fields[19]=inscricoes_abertas&fields[20]=data_inicio_curso&fields[21]=lingua&fields[22]=aviso_matricula&populate[imagem][fields][0]=url&populate[mentor][populate][imagem][fields][0]=url&populate[mentor][fields][0]=nome&populate[mentor][fields][1]=profissao&populate[mentor][fields][2]=descricao&populate[mentor][fields][3]=alunos&populate[mentor][fields][4]=cursos&populate[mentor][fields][5]=instagram&populate[mentor][fields][6]=instagram_label&populate[mentor][fields][7]=pais&populate[mentor][populate][reviews]=*&populate[videos][populate]=video&populate[tags][fields][0]=nome&populate[cronograma][fields][0]=data_fim&populate[cronograma][fields][1]=data_inicio&populate[cronograma][fields][2]=faixa_etaria&populate[cronograma][fields][3]=dia_semana&populate[cronograma][fields][4]=horario_aula&populate[cronograma][fields][5]=link_aula&populate[cupons][fields][0]=nome&populate[cupons][fields][1]=url&populate[cupons][fields][2]=valido&populate[cupons][fields][3]=validade&populate[cupons][fields][4]=voucher_gratuito&populate[ementa_resumida][fields][0]=descricao&populate[resumo_aulas][fields][0]=nome_aula&populate[resumo_aulas][fields][1]=descricao_aula&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[alunos][fields][1]=turma&populate[alunos][fields][2]=documentId&populate[alunos][fields][3]=nome&populate[alunos][fields][4]=email_responsavel&populate[alunos][fields][5]=telefone_responsavel&populate[alunos][fields][6]=escola_parceira&populate[alunos][fields][7]=createdAt&populate[review][fields][0]=id&populate[review][fields][1]=nota&populate[review][fields][2]=descricao&populate[review][fields][3]=nome&locale=pt-BR`
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

    console.log("Buscando aluno no Strapi com CPF:", cpf);
    const url = `${STRAPI_API_URL}/api/alunos?filters[cpf_aluno][$eq]=${cpf}&filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=documentId`;
    console.log("URL da API:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("Status da resposta:", response.status, response.statusText);

    if (!response.ok) {
      console.error(
        "Erro na resposta da API:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch student");
    }

    const data = await response.json();
    console.log("Dados brutos retornados:", data);

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.log("Nenhum aluno encontrado ou dados inválidos");
      return null;
    }

    const aluno = data.data[0];
    const attributes = aluno?.attributes ?? aluno; // Suporta formatos com e sem 'attributes'
    const cursosRaw = attributes?.cursos?.data ?? attributes?.cursos ?? [];

    console.log("Aluno (raw) para mapeamento:", {
      id: aluno?.id,
      attributesKeys: attributes ? Object.keys(attributes) : null,
      hasCursosData: Array.isArray(attributes?.cursos?.data),
      cursosLength: Array.isArray(cursosRaw) ? cursosRaw.length : 0,
    });

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

    console.log("Aluno mapeado:", student);
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
      cursos: { connect: Array<{ id: number }> };
      usou_voucher?: boolean;
      portador_deficiencia?: boolean;
      descricao_deficiencia?: string;
    } = {
      cursos: {
        connect: [{ id: courseId }],
      },
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

export async function fetchAllStudents(): Promise<Student[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&fields[0]=turma`
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
      `${STRAPI_API_URL}/api/cursos?fields[0]=id&fields[1]=titulo&locale=pt-BR`
    );

    if (!coursesResponse.ok) {
      throw new Error("Failed to fetch courses");
    }

    const coursesData = await coursesResponse.json();
    const courses = coursesData.data as CourseData[];

    // Fetch all students with their courses
    const studentsResponse = await fetch(
      `${STRAPI_API_URL}/api/alunos?filters[habilitado][$eq]=true&populate[cursos][fields][0]=id`
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
      faixa_etaria?: string;
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
        courseData.cronograma || currentData.cronograma
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
