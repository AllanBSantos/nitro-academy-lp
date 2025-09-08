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
    console.log(
      "verifyUserRole called with token:",
      token.substring(0, 20) + "..."
    );
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("Token inválido");
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const userId = payload.id;
    const userEmail = payload.email;

    console.log("Token payload:", { userId, userEmail });

    if (!userId) {
      throw new Error("Token não contém ID do usuário");
    }

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      throw new Error("Configuração do servidor incompleta");
    }

    // Check if this is a WhatsApp user (ID 999)
    if (userId === 999 && userEmail && userEmail.includes("@whatsapp.user")) {
      console.log("Processing WhatsApp user:", userEmail);
      // This is a WhatsApp user, extract WhatsApp number
      const whatsappNumber = userEmail.replace("@whatsapp.user", "");
      console.log("WhatsApp number:", whatsappNumber);

      // Try to find student by WhatsApp number (try both formats)
      try {
        console.log(
          "Searching for student with WhatsApp number:",
          whatsappNumber
        );
        const studentResponse = await safeFetch(
          `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${whatsappNumber}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let studentData = null;
        if (studentResponse && studentResponse.ok) {
          studentData = await studentResponse.json();

          // If not found, try without country code
          if (studentData.data && studentData.data.length === 0) {
            const withoutCountryCode = whatsappNumber.replace(/^55/, "");
            console.log(
              "Trying student search without country code:",
              withoutCountryCode
            );
            const newStudentResponse = await safeFetch(
              `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${withoutCountryCode}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (newStudentResponse && newStudentResponse.ok) {
              studentData = await newStudentResponse.json();
            }
          }
        }

        if (studentData && studentData.data && studentData.data.length > 0) {
          console.log("Student found:", studentData.data[0].id);
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
        console.log(
          "Searching for mentor with WhatsApp number:",
          whatsappNumber
        );
        const mentorResponse = await safeFetch(
          `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${whatsappNumber}&locale=pt-BR`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let mentorData = null;
        if (mentorResponse && mentorResponse.ok) {
          mentorData = await mentorResponse.json();

          // If not found, try without country code
          if (mentorData.data && mentorData.data.length === 0) {
            const withoutCountryCode = whatsappNumber.replace(/^55/, "");
            console.log(
              "Trying mentor search without country code:",
              withoutCountryCode
            );
            const newMentorResponse = await safeFetch(
              `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${withoutCountryCode}&locale=pt-BR`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (newMentorResponse && newMentorResponse.ok) {
              mentorData = await newMentorResponse.json();
            }
          }
        }

        if (mentorData && mentorData.data && mentorData.data.length > 0) {
          console.log("Mentor found:", mentorData.data[0].id);
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
        console.log(
          "Searching for admin with WhatsApp number:",
          whatsappNumber
        );
        const adminResponse = await safeFetch(
          `${STRAPI_URL}/api/admins?filters[celular][$eq]=${whatsappNumber}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let adminData = null;
        if (adminResponse && adminResponse.ok) {
          adminData = await adminResponse.json();

          // If not found, try without country code
          if (adminData.data && adminData.data.length === 0) {
            const withoutCountryCode = whatsappNumber.replace(/^55/, "");
            console.log(
              "Trying admin search without country code:",
              withoutCountryCode
            );
            const newAdminResponse = await safeFetch(
              `${STRAPI_URL}/api/admins?filters[celular][$eq]=${withoutCountryCode}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (newAdminResponse && newAdminResponse.ok) {
              adminData = await newAdminResponse.json();
            }
          }
        }

        if (adminData && adminData.data && adminData.data.length > 0) {
          console.log("Admin found:", adminData.data[0].id);
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

      console.log(
        "No user found for WhatsApp number, returning authenticated role"
      );
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
    console.log("Processing regular Strapi user:", userId);
    const userResponse = await safeFetch(
      `${STRAPI_URL}/api/users/${userId}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    console.log("User response status:", userResponse?.status);
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
    console.log("User data received:", {
      id: userData.id,
      roleId: userData.role?.id,
      hasMentor: !!userData.mentor,
      hasStudent: !!userData.student,
    });

    // Get user's role details
    console.log("Fetching role details for role ID:", userData.role.id);
    const roleResponse = await safeFetch(
      `${STRAPI_URL}/api/users-permissions/roles/${userData.role.id}`,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    console.log("Role response status:", roleResponse?.status);
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
    console.log("Role data received:", {
      roleId: roleData.role?.id,
      roleType: roleData.role?.type,
      roleName: roleData.role?.name,
    });

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

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    console.log("Environment check:", {
      STRAPI_URL: STRAPI_URL ? "SET" : "NOT SET",
      ADMIN_TOKEN: ADMIN_TOKEN ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    });

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

    // Test Strapi connectivity first
    try {
      console.log("Testing Strapi connectivity...");
      const healthResponse = await safeFetch(
        `${STRAPI_URL}/api/cursos?pagination[limit]=1`,
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );

      console.log("Strapi health check status:", healthResponse?.status);
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
      console.log(
        "Starting role verification for token:",
        token.substring(0, 20) + "..."
      );
      userRole = await verifyUserRole(token);
      console.log("Role verification successful:", {
        userId: userRole.userId,
        roleType: userRole.role.type,
        mentorId: userRole.mentorId,
        studentId: userRole.studentId,
      });
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
    let coursesUrl = `${STRAPI_URL}/api/cursos?populate=*&locale=pt-BR`;

    if (userRole.role.type === "mentor") {
      if (userRole.mentorId) {
        // Mentor with mentorId: filter by mentor ID
        coursesUrl += `&filters[mentor][id][$eq]=${userRole.mentorId}`;
        console.log("Mentor courses URL:", coursesUrl);
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
    // Admin: show all courses (no filter)

    console.log("Fetching courses from URL:", coursesUrl);
    const coursesResponse = await safeFetch(coursesUrl, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    console.log("Courses response status:", coursesResponse?.status);
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
    console.log("Courses data received:", {
      dataLength: coursesData.data?.length || 0,
      hasData: !!coursesData.data,
    });

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
