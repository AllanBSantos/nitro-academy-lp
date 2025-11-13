import { NextRequest, NextResponse } from "next/server";

// Helper function to safely fetch with timeout and error handling
const safeFetch = async (url: string, options: RequestInit = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.error(`Safe fetch failed for ${url}:`, error);
    return null;
  }
};

async function verifyUserRole(token: string) {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("Token inválido");
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const userId = payload.id;
    const userEmail = payload.email;

    if (!userId) {
      throw new Error("Token não contém ID do usuário");
    }

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      throw new Error("Configuração do servidor incompleta");
    }

    // Check if this is a WhatsApp user (ID 999)
    if (userId === 999 && userEmail && userEmail.includes("@whatsapp.user")) {
      // This is a WhatsApp user, extract WhatsApp number
      const whatsappNumber = userEmail.replace("@whatsapp.user", "");

      // Try to find student by WhatsApp number (try both formats)
      try {
        const studentResponse = await safeFetch(
          `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${whatsappNumber}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${ADMIN_TOKEN}`,
            },
          }
        );

        let studentData = null;
        if (studentResponse && studentResponse.ok) {
          studentData = await studentResponse.json();

          // If not found, try without country code
          if (studentData.data && studentData.data.length === 0) {
            const withoutCountryCode = whatsappNumber.replace(/^55/, "");
            const newStudentResponse = await safeFetch(
              `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${withoutCountryCode}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
              }
            );

            if (newStudentResponse && newStudentResponse.ok) {
              studentData = await newStudentResponse.json();
            }
          }
        }

        if (studentData && studentData.data && studentData.data.length > 0) {
          // Student found
          return {
            userId: 999,
            role: {
              id: 4, // Student role ID
              type: "student",
              name: "Student",
            },
            studentId: studentData.data[0].id,
            mentorId: null,
            permissions: {},
          };
        }
      } catch (error) {
        console.error("Error searching for student:", error);
      }

      // Try to find mentor by WhatsApp number (try both formats)
      try {
        const mentorResponse = await safeFetch(
          `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${whatsappNumber}&locale=pt-BR`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${ADMIN_TOKEN}`,
            },
          }
        );

        let mentorData = null;
        if (mentorResponse && mentorResponse.ok) {
          mentorData = await mentorResponse.json();

          // If not found, try without country code
          if (mentorData.data && mentorData.data.length === 0) {
            const withoutCountryCode = whatsappNumber.replace(/^55/, "");
            const newMentorResponse = await safeFetch(
              `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${withoutCountryCode}&locale=pt-BR`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
              }
            );

            if (newMentorResponse && newMentorResponse.ok) {
              mentorData = await newMentorResponse.json();
            }
          }
        }

        if (mentorData && mentorData.data && mentorData.data.length > 0) {
          // Mentor found
          return {
            userId: 999,
            role: {
              id: 3, // Mentor role ID
              type: "mentor",
              name: "Mentor",
            },
            mentorId: mentorData.data[0].id,
            studentId: null,
            permissions: {},
          };
        }
      } catch (error) {
        console.error("Error searching for mentor:", error);
      }

      // Try to find admin by WhatsApp number (try both formats)
      try {
        const adminResponse = await safeFetch(
          `${STRAPI_URL}/api/admins?filters[celular][$eq]=${whatsappNumber}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${ADMIN_TOKEN}`,
            },
          }
        );

        let adminData = null;
        if (adminResponse && adminResponse.ok) {
          adminData = await adminResponse.json();

          // If not found, try without country code
          if (adminData.data && adminData.data.length === 0) {
            const withoutCountryCode = whatsappNumber.replace(/^55/, "");
            const newAdminResponse = await safeFetch(
              `${STRAPI_URL}/api/admins?filters[celular][$eq]=${withoutCountryCode}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
              }
            );

            if (newAdminResponse && newAdminResponse.ok) {
              adminData = await newAdminResponse.json();
            }
          }
        }

        if (adminData && adminData.data && adminData.data.length > 0) {
          // Admin found
          return {
            userId: 999,
            role: {
              id: 5, // Admin role ID
              type: "admin",
              name: "Admin",
            },
            studentId: null,
            mentorId: null,
            adminId: adminData.data[0].id,
            permissions: {},
          };
        }
      } catch (error) {
        console.error("Error searching for admin:", error);
      }

      // If not found, return authenticated role
      return {
        userId: 999,
        role: {
          id: 1, // Authenticated role ID
          type: "authenticated",
          name: "Authenticated",
        },
        studentId: null,
        mentorId: null,
        permissions: {},
      };
    }

    // Original logic for regular Strapi users
    const userResponse = await safeFetch(
      `${STRAPI_URL}/api/users/${userId}?populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (!userResponse || !userResponse.ok) {
      const errorText = userResponse
        ? await userResponse.text()
        : "No response";
      console.error("User fetch failed:", {
        status: userResponse?.status,
        statusText: userResponse?.statusText,
        errorText,
      });
      throw new Error("Erro ao obter dados do usuário");
    }

    const userData = await userResponse.json();

    // Get user's role details
    const roleResponse = await safeFetch(
      `${STRAPI_URL}/api/users-permissions/roles/${userData.role.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (!roleResponse || !roleResponse.ok) {
      const errorText = roleResponse
        ? await roleResponse.text()
        : "No response";
      console.error("Role fetch failed:", {
        status: roleResponse?.status,
        statusText: roleResponse?.statusText,
        errorText,
      });
      throw new Error("Erro ao obter informações do role");
    }

    const roleData = await roleResponse.json();

    return {
      userId: userData.id,
      role: {
        id: userData.role.id,
        type: userData.role.type,
        name: userData.role.name,
      },
      mentorId: userData.mentor?.id || null,
      studentId: userData.student?.id || null,
      permissions: roleData.role.permissions || {},
    };
  } catch (error) {
    console.error("Error in verifyUserRole helper:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 400 }
      );
    }

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      console.error("Missing environment variables:", {
        STRAPI_URL: !!STRAPI_URL,
        ADMIN_TOKEN: !!ADMIN_TOKEN,
        NODE_ENV: process.env.NODE_ENV,
      });
      return NextResponse.json(
        {
          error: "Configuração do servidor incompleta",
          details: {
            STRAPI_URL: !!STRAPI_URL,
            ADMIN_TOKEN: !!ADMIN_TOKEN,
            NODE_ENV: process.env.NODE_ENV,
          },
        },
        { status: 500 }
      );
    }

    try {
      const healthResponse = await safeFetch(
        `${STRAPI_URL}/api/cursos?pagination[limit]=1`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );

      if (!healthResponse || !healthResponse.ok) {
        const errorText = healthResponse
          ? await healthResponse.text()
          : "No response";
        console.error("Strapi connectivity failed:", {
          status: healthResponse?.status,
          statusText: healthResponse?.statusText,
          errorText,
        });
        return NextResponse.json(
          {
            error: "Erro de conectividade com o servidor",
            details: {
              status: healthResponse?.status,
              statusText: healthResponse?.statusText,
            },
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Strapi connectivity test failed:", error);
      return NextResponse.json(
        {
          error: "Erro de conectividade com o servidor",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    // Verify user role using helper function
    let userRole;
    try {
      userRole = await verifyUserRole(token);
    } catch (error) {
      console.error("Role verification failed:", error);
      return NextResponse.json(
        {
          error: "Falha na verificação de permissões",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 400 }
      );
    }

    // Fetch courses based on user role
    let coursesUrl = `${STRAPI_URL}/api/cursos?populate[cronograma][fields][0]=dia_semana&populate[cronograma][fields][1]=horario_aula&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[alunos][fields][1]=nome&populate[mentor][fields][0]=nome&populate[campanhas][fields][0]=id&populate[campanhas][fields][1]=nome&populate[campanhas][fields][2]=createdAt&locale=pt-BR`;

    if (userRole.role.type === "mentor") {
      // Mentor: filter by habilitado = true and mentor ID
      coursesUrl += `&filters[habilitado][$eq]=true`;
      if (userRole.mentorId) {
        coursesUrl += `&filters[mentor][id][$eq]=${userRole.mentorId}`;
      } else {
        // Mentor without mentorId: deny access - needs to complete identification
        return NextResponse.json(
          {
            error:
              "Mentor não identificado. Complete o processo de identificação primeiro.",
            needsIdentification: true,
          },
          { status: 403 }
        );
      }
    } else if (userRole.role.type === "student") {
      // Student: only show courses they're enrolled in
      return NextResponse.json(
        { error: "Estudantes não podem acessar lista de cursos" },
        { status: 403 }
      );
    }
    // Admin: show all courses (including habilitado = false)

    const coursesResponse = await safeFetch(coursesUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    if (!coursesResponse || !coursesResponse.ok) {
      const errorText = coursesResponse
        ? await coursesResponse.text()
        : "No response";
      console.error("Courses fetch failed:", {
        status: coursesResponse?.status,
        statusText: coursesResponse?.statusText,
        errorText,
      });
      return NextResponse.json(
        { error: "Erro ao buscar cursos" },
        { status: 500 }
      );
    }

    const coursesData = await coursesResponse.json();

    return NextResponse.json({
      courses: coursesData.data || [],
      userRole: userRole.role.type,
      mentorId: userRole.mentorId,
      totalCourses: coursesData.data?.length || 0,
    });
  } catch (error) {
    console.error("Error in filtered courses API:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
