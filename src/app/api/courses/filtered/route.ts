import { NextRequest, NextResponse } from "next/server";

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

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      throw new Error("Configuração do servidor incompleta");
    }

    // Check if this is a WhatsApp user (ID 999)
    if (userId === 999 && userEmail && userEmail.includes("@whatsapp.user")) {
      // This is a WhatsApp user, extract WhatsApp number
      const whatsappNumber = userEmail.replace("@whatsapp.user", "");

      // Try to find student by WhatsApp number (try both formats)
      let studentResponse = await fetch(
        `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${whatsappNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If not found, try without country code
      if (studentResponse.ok) {
        const studentData = await studentResponse.json();
        if (studentData.data && studentData.data.length === 0) {
          const withoutCountryCode = whatsappNumber.replace(/^55/, "");
          studentResponse = await fetch(
            `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${withoutCountryCode}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      if (studentResponse.ok) {
        const studentData = await studentResponse.json();
        if (studentData.data && studentData.data.length > 0) {
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
      }

      // Try to find mentor by WhatsApp number (try both formats)
      let mentorResponse = await fetch(
        `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${whatsappNumber}&locale=pt-BR`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If not found, try without country code
      if (mentorResponse.ok) {
        const mentorData = await mentorResponse.json();
        if (mentorData.data && mentorData.data.length === 0) {
          const withoutCountryCode = whatsappNumber.replace(/^55/, "");
          mentorResponse = await fetch(
            `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${withoutCountryCode}&locale=pt-BR`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      if (mentorResponse.ok) {
        const mentorData = await mentorResponse.json();
        if (mentorData.data && mentorData.data.length > 0) {
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
      }

      // Try to find admin by WhatsApp number (try both formats)
      let adminResponse = await fetch(
        `${STRAPI_URL}/api/admins?filters[celular][$eq]=${whatsappNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If not found, try without country code
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        if (adminData.data && adminData.data.length === 0) {
          const withoutCountryCode = whatsappNumber.replace(/^55/, "");
          adminResponse = await fetch(
            `${STRAPI_URL}/api/admins?filters[celular][$eq]=${withoutCountryCode}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        if (adminData.data && adminData.data.length > 0) {
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
    const userResponse = await fetch(
      `${STRAPI_URL}/api/users/${userId}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("Erro ao obter dados do usuário");
    }

    const userData = await userResponse.json();

    // Get user's role details
    const roleResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles/${userData.role.id}`,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    if (!roleResponse.ok) {
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
    console.error("Error in verifyUserRole helper:", error);
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

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
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
        { error: "Falha na verificação de permissões" },
        { status: 400 }
      );
    }

    // Fetch courses based on user role
    let coursesUrl = `${STRAPI_URL}/api/cursos?populate=*&locale=pt-BR`;

    if (userRole.role.type === "mentor") {
      if (userRole.mentorId) {
        // Mentor with mentorId: filter by mentor ID
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
    // Admin: show all courses (no filter)

    const coursesResponse = await fetch(coursesUrl, {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    if (!coursesResponse.ok) {
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
    console.error("Error in filtered courses API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
