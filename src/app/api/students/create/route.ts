import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

interface StudentPayload {
  nome: string;
  data_nascimento: string;
  cpf_aluno: string;
  responsavel?: string;
  email_responsavel?: string;
  cpf_responsavel?: string;
  telefone_responsavel?: string;
  pais?: string;
  estado?: string;
  cidade?: string;
  telefone_aluno?: string;
  portador_deficiencia?: boolean;
  descricao_deficiencia?: string;
  cursos: Array<{ id: number }>;
  escola_parceira?: string;
  turma?: number;
  usou_voucher?: boolean;
}

// Função auxiliar para buscar aluno por CPF
async function findStudentByCPF(cpf: string): Promise<any | null> {
  try {
    const cleanCPF = cpf.replace(/\D/g, "");
    
    if (!cleanCPF || cleanCPF.length !== 11) {
      return null;
    }

    const url = `${STRAPI_API_URL}/api/alunos?filters[cpf_aluno][$eq]=${cleanCPF}&filters[habilitado][$eq]=true&populate[cursos][fields][0]=id&populate[cursos][fields][1]=documentId&publicationState=preview`;

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
      return null;
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error("Error finding student:", error);
    return null;
  }
}

// Função auxiliar para atualizar cursos do aluno
async function updateStudentCourses(
  documentId: string,
  courseId: number,
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
      cursos: {
        set: [{ id: courseId }],
      },
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

export async function POST(request: NextRequest) {
  try {
    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "STRAPI_TOKEN não configurado" },
        { status: 500 }
      );
    }

    const student: StudentPayload = await request.json();

    // Limpar formatação do CPF
    const cleanCPF = student.cpf_aluno.replace(/\D/g, "");
    const cleanCPFResponsavel = student.cpf_responsavel?.replace(/\D/g, "") || "";

    // Verificar se aluno já existe
    const existingStudent = await findStudentByCPF(cleanCPF);

    if (existingStudent) {
      // Atualizar cursos do aluno existente
      const documentId = existingStudent.documentId || existingStudent.id;
      await updateStudentCourses(
        documentId,
        student.cursos[0].id,
        student.usou_voucher || false,
        student.portador_deficiencia,
        student.descricao_deficiencia
      );

      return NextResponse.json({
        success: true,
        student: existingStudent,
        updated: true,
      });
    }

    // Criar novo aluno
    const payload = {
      data: {
        nome: student.nome,
        data_nascimento: student.data_nascimento,
        cpf_aluno: cleanCPF,
        responsavel: student.responsavel,
        email_responsavel: student.email_responsavel,
        cpf_responsavel: cleanCPFResponsavel || undefined,
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
        usou_voucher: student.usou_voucher || false,
      },
    };

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    };

    const response = await fetch(`${STRAPI_API_URL}/api/alunos`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Strapi Error:", errorData);
      return NextResponse.json(
        { error: "Failed to create student", details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      student: result.data,
      updated: false,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

