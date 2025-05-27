interface ClassAppAddress {
  address: string;
  type: "PHONE" | "EMAIL";
  tags?: string[];
}

interface ClassAppGroup {
  name: string;
}

interface ClassAppStudentData {
  fullname: string;
  disabled: boolean;
  addresses: ClassAppAddress[];
  groups: ClassAppGroup[];
  eid: string;
}

interface ClassAppResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface StudentData {
  nome: string;
  telefone_aluno?: string;
  email_responsavel: string;
  telefone_responsavel: string;
  curso: {
    titulo: string;
  };
  turma: number;
  locale?: string;
  cpf_aluno: string;
}

function formatGroupName(
  courseTitle: string,
  classNumber: number,
  locale: string = "pt"
): string {
  const isEnglish = locale === "en";
  const classPrefix = isEnglish ? "Class" : "Turma";
  return `${courseTitle} - ${classPrefix} ${classNumber}`;
}

export async function createOrUpdateClassappStudent(
  studentData: StudentData
): Promise<ClassAppResponse> {
  try {

    if (!!studentData.cpf_aluno === false) {
      throw new Error("Student CPF is required");
    }

    const addresses: ClassAppAddress[] = [];

    if (studentData.telefone_aluno) {
      addresses.push({
        address: studentData.telefone_aluno,
        type: "PHONE",
        tags: ["Aluno"],
      });
    }

    if (studentData.telefone_responsavel) {
      addresses.push({
        address: studentData.telefone_responsavel,
        type: "PHONE",
        tags: ["Responsável Pedagógico"],
      });
    }

    if (studentData.email_responsavel) {
      addresses.push({
        address: studentData.email_responsavel,
        type: "EMAIL",
        tags: ["Responsável Pedagógico"],
      });
    }

    const classappData: ClassAppStudentData = {
      fullname: studentData.nome,
      disabled: false,
      addresses,
      groups: [
        {
          name: formatGroupName(
            studentData.curso.titulo,
            studentData.turma,
            studentData.locale
          ),
        },
      ],
      eid: studentData.cpf_aluno,
    };

    const response = await fetch("/api/classapp/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentData: classappData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to create/update student in ClassApp"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating/updating student in ClassApp:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
