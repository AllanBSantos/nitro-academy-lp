import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Decode JWT to get user ID
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        return NextResponse.json({ error: "Token inválido" }, { status: 400 });
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.id;
      const userEmail = payload.email;

      if (!userId) {
        return NextResponse.json(
          { error: "Token não contém ID do usuário" },
          { status: 400 }
        );
      }

      // Check if this is a WhatsApp user (ID 999)
      if (userId === 999 && userEmail && userEmail.includes("@whatsapp.user")) {
        // This is a WhatsApp user, extract WhatsApp number
        const whatsappNumber = userEmail.replace("@whatsapp.user", "");

        // Try to find student by WhatsApp number (try both formats)
        // Try WITHOUT country code first (production has phones without country code)
        const withoutCountryCode = whatsappNumber.replace(/^55/, "");

        const studentResponse = await fetch(
          `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${withoutCountryCode}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let studentData = null;

        // Parse the response data
        if (studentResponse.ok) {
          studentData = await studentResponse.json();

          // If not found, try WITH country code
          if (studentData.data && studentData.data.length === 0) {
            const newStudentResponse = await fetch(
              `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${whatsappNumber}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (newStudentResponse.ok) {
              studentData = await newStudentResponse.json();
            }
          }
        }

        if (studentData) {
          if (studentData.data && studentData.data.length > 0) {
            // Student found
            return NextResponse.json({
              userId: 999,
              role: {
                id: 4, // Student role ID
                type: "student",
                name: "Student",
              },
              studentId: studentData.data[0].id,
              mentorId: null,
              permissions: {},
            });
          }
        }

        // Try to find mentor by WhatsApp number (try WITHOUT country code first)
        const mentorResponse = await fetch(
          `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${withoutCountryCode}&locale=pt-BR`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let mentorData = null;

        // Parse the response data
        if (mentorResponse.ok) {
          mentorData = await mentorResponse.json();

          // If not found, try WITH country code
          if (mentorData.data && mentorData.data.length === 0) {
            const newMentorResponse = await fetch(
              `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${whatsappNumber}&locale=pt-BR`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (newMentorResponse.ok) {
              mentorData = await newMentorResponse.json();
            }
          }
        }

        if (mentorData) {
          if (mentorData.data && mentorData.data.length > 0) {
            // Mentor found
            return NextResponse.json({
              userId: 999,
              role: {
                id: 3, // Mentor role ID
                type: "mentor",
                name: "Mentor",
              },
              mentorId: mentorData.data[0].id,
              studentId: null,
              permissions: {},
            });
          }
        }

        // Try to find admin by WhatsApp number (try WITHOUT country code first)
        const adminResponse = await fetch(
          `${STRAPI_URL}/api/admins?filters[celular][$eq]=${withoutCountryCode}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let adminData = null;

        // Parse the response data
        if (adminResponse.ok) {
          adminData = await adminResponse.json();

          // If not found, try WITH country code
          if (adminData.data && adminData.data.length === 0) {
            const newAdminResponse = await fetch(
              `${STRAPI_URL}/api/admins?filters[celular][$eq]=${whatsappNumber}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (newAdminResponse.ok) {
              adminData = await newAdminResponse.json();
            }
          }
        }

        if (adminData) {
          if (adminData.data && adminData.data.length > 0) {
            // Admin found
            return NextResponse.json({
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
            });
          }
        }

        // If not found, return authenticated role
        return NextResponse.json({
          userId: 999,
          role: {
            id: 1, // Authenticated role ID
            type: "authenticated",
            name: "Authenticated",
          },
          studentId: null,
          mentorId: null,
          permissions: {},
        });
      }

      // Get user data using admin token
      const userResponse = await fetch(
        `${STRAPI_URL}/api/users/${userId}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );

      if (!userResponse.ok) {
        return NextResponse.json(
          { error: "Erro ao obter dados do usuário" },
          { status: 500 }
        );
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
        return NextResponse.json(
          { error: "Erro ao obter informações do role" },
          { status: 500 }
        );
      }

      const roleData = await roleResponse.json();

      // Extract mentor, student IDs from user data
      const mentorId = userData.mentor?.id || null;
      const studentId = userData.student?.id || null;

      // For regular Strapi users, adminId is not available in the user data
      // Only WhatsApp users have adminId
      const adminId = null;

      return NextResponse.json({
        userId: userData.id,
        role: {
          id: userData.role.id,
          type: userData.role.type,
          name: userData.role.name,
        },
        mentorId,
        studentId,
        adminId,
        permissions: roleData.role.permissions || {},
      });
    } catch (decodeError) {
      console.error("Error decoding JWT:", decodeError);
      return NextResponse.json(
        { error: "Erro ao decodificar token" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verify-role API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
