import { NextRequest, NextResponse } from "next/server";
import { formatInternationalPhone } from "@/lib/utils";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

// Simple JWT creation function for WhatsApp users
function createSimpleJWT(whatsapp: string): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    id: 999,
    email: `${whatsapp}@whatsapp.user`,
    username: `user_${whatsapp}`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  // Simple base64 encoding (not secure, just for testing)
  const encodedHeader = Buffer.from(JSON.stringify(header))
    .toString("base64")
    .replace(/=/g, "");
  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/=/g, "");

  // Create a simple signature (not secure, just for testing)
  const signature = Buffer.from(`whatsapp_${whatsapp}_${Date.now()}`)
    .toString("base64")
    .replace(/=/g, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const { whatsapp, code } = await request.json();

    if (!whatsapp || !code) {
      return NextResponse.json(
        { error: "WhatsApp e código são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate and format WhatsApp number (international format)
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    // Check if it's a valid phone number
    if (cleanWhatsapp.length < 8 || cleanWhatsapp.length > 15) {
      return NextResponse.json(
        { error: "Número de WhatsApp inválido" },
        { status: 400 }
      );
    }

    // Use the utility function to format the phone number
    const formattedWhatsapp = formatInternationalPhone(cleanWhatsapp);

    const ZAZU_URL = process.env.NEXT_PUBLIC_ZAZU_API_URL;

    if (!ZAZU_URL) {
      return NextResponse.json(
        { error: "ZAZU_URL não configurado" },
        { status: 500 }
      );
    }

    if (!STRAPI_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    const strapiHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    };

    // Call Zazu API to validate auth code
    const response = await fetch(`${ZAZU_URL}/auth-code/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        whatsappNumber: formattedWhatsapp,
        code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.error || "Código inválido ou expirado",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // For now, create a simple JWT token for WhatsApp users
    // This will allow them to access the protected routes
    const simpleJWT = createSimpleJWT(formattedWhatsapp);

    // Determine user type from Zazu response
    let userType = data.data?.userType;

    // If Zazu didn't provide a specific user type, try to determine it from database
    if (!userType) {
      // Try to find admin first
      const adminResponse = await fetch(
        `${STRAPI_URL}/api/admins?filters[celular][$eq]=${formattedWhatsapp}`,
        {
          headers: strapiHeaders,
        }
      );

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        if (adminData.data && adminData.data.length > 0) {
          userType = "admin";
        }
      }

      // If not admin, try to find mentor
      if (!userType) {
        const mentorResponse = await fetch(
          `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${formattedWhatsapp}&locale=pt-BR`,
          {
            headers: strapiHeaders,
          }
        );

        if (mentorResponse.ok) {
          const mentorData = await mentorResponse.json();
          if (mentorData.data && mentorData.data.length > 0) {
            userType = "mentor";
          }
        }
      }

      // If not mentor, try to find student
      if (!userType) {
        const studentResponse = await fetch(
          `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${formattedWhatsapp}`,
          {
            headers: strapiHeaders,
          }
        );

        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          if (studentData.data && studentData.data.length > 0) {
            userType = "student";
          }
        }
      }

      // If still not found, try without country code
      if (userType === "new_user") {
        const withoutCountryCode = formattedWhatsapp.replace(/^55/, "");

        // Try admin without country code
        const adminResponse2 = await fetch(
          `${STRAPI_URL}/api/admins?filters[celular][$eq]=${withoutCountryCode}`,
          {
            headers: strapiHeaders,
          }
        );

        if (adminResponse2.ok) {
          const adminData = await adminResponse2.json();
          if (adminData.data && adminData.data.length > 0) {
            userType = "admin";
          }
        }

        // Try mentor without country code
        if (!userType) {
          const mentorResponse2 = await fetch(
            `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${withoutCountryCode}&locale=pt-BR`,
            {
              headers: strapiHeaders,
            }
          );

          if (mentorResponse2.ok) {
            const mentorData = await mentorResponse2.json();
            if (mentorData.data && mentorData.data.length > 0) {
              userType = "mentor";
            }
          }
        }

        // Try student without country code
        if (!userType) {
          const studentResponse2 = await fetch(
            `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${withoutCountryCode}`,
            {
              headers: strapiHeaders,
            }
          );

          if (studentResponse2.ok) {
            const studentData = await studentResponse2.json();
            if (studentData.data && studentData.data.length > 0) {
              userType = "student";
            }
          }
        }
      }
    }

    // If we have a specific user type (not new_user), try to link automatically
    if (userType !== "new_user") {
      try {
        // Try to find student by WhatsApp number (try both formats)
        if (userType === "student") {
          // Try with country code first
          let studentResponse = await fetch(
            `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${formattedWhatsapp}`,
            {
              headers: strapiHeaders,
            }
          );

          // If not found, try without country code
          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            if (studentData.data && studentData.data.length === 0) {
              const withoutCountryCode = formattedWhatsapp.replace(/^55/, "");
              studentResponse = await fetch(
                `${STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${withoutCountryCode}`,
                {
                  headers: strapiHeaders,
                }
              );
            }
          }

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();
            if (studentData.data && studentData.data.length > 0) {
              // Student found, return with student info
              return NextResponse.json({
                success: true,
                message: "Login realizado com sucesso",
                data: {
                  whatsapp: formattedWhatsapp,
                  userType: userType,
                  token: simpleJWT,
                  user: {
                    id: 999,
                    username: `user_${formattedWhatsapp}`,
                    email: `${formattedWhatsapp}@whatsapp.user`,
                  },
                  isLinked: true,
                  linkedType: "student",
                  linkedId: studentData.data[0].id,
                },
              });
            }
          }
        }

        // Try to find mentor by WhatsApp number (try both formats)
        if (userType === "mentor") {
          // Try with country code first
          let mentorResponse = await fetch(
            `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${formattedWhatsapp}&locale=pt-BR`,
            {
              headers: strapiHeaders,
            }
          );

          // If not found, try without country code
          if (mentorResponse.ok) {
            const mentorData = await mentorResponse.json();
            if (mentorData.data && mentorData.data.length === 0) {
              const withoutCountryCode = formattedWhatsapp.replace(/^55/, "");
              mentorResponse = await fetch(
                `${STRAPI_URL}/api/mentores?filters[celular][$eq]=${withoutCountryCode}&locale=pt-BR`,
                {
                  headers: strapiHeaders,
                }
              );
            }
          }

          if (mentorResponse.ok) {
            const mentorData = await mentorResponse.json();
            if (mentorData.data && mentorData.data.length > 0) {
              // Mentor found, return with mentor info
              return NextResponse.json({
                success: true,
                message: "Login realizado com sucesso",
                data: {
                  whatsapp: formattedWhatsapp,
                  userType: userType,
                  token: simpleJWT,
                  user: {
                    id: 999,
                    username: `user_${formattedWhatsapp}`,
                    email: `${formattedWhatsapp}@whatsapp.user`,
                  },
                  isLinked: true,
                  linkedType: "mentor",
                  linkedId: mentorData.data[0].id,
                },
              });
            }
          }
        }

        // Try to find admin by WhatsApp number (try both formats)
        if (userType === "admin") {
          let adminResponse = await fetch(
            `${STRAPI_URL}/api/admins?filters[celular][$eq]=${formattedWhatsapp}`,
            {
              headers: strapiHeaders,
            }
          );

          // If not found, try without country code
          if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            if (adminData.data && adminData.data.length === 0) {
              const withoutCountryCode = formattedWhatsapp.replace(/^55/, "");
              adminResponse = await fetch(
                `${STRAPI_URL}/api/admins?filters[celular][$eq]=${withoutCountryCode}`,
                {
                  headers: strapiHeaders,
                }
              );
            }
          }

          if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            if (adminData.data && adminData.data.length > 0) {
              // Admin found, return with admin info
              return NextResponse.json({
                success: true,
                message: "Login realizado com sucesso",
                data: {
                  whatsapp: formattedWhatsapp,
                  userType: userType,
                  token: simpleJWT,
                  user: {
                    id: 999,
                    username: `user_${formattedWhatsapp}`,
                    email: `${formattedWhatsapp}@whatsapp.user`,
                  },
                  isLinked: true,
                  linkedType: "admin",
                  linkedId: adminData.data[0].id,
                },
              });
            }
          }
        }
      } catch (linkError) {
        console.error("Error linking user automatically:", linkError);
        // Continue with normal response if linking fails
      }
    }

    // Default response (if user type not found)
    return NextResponse.json({
      success: true,
      message: "Código validado com sucesso",
      data: {
        whatsapp: formattedWhatsapp,
        userType: userType || "unknown",
        token: simpleJWT,
        user: {
          id: 999, // Temporary ID for WhatsApp users
          username: `user_${formattedWhatsapp}`,
          email: `${formattedWhatsapp}@whatsapp.user`,
        },
      },
    });
  } catch (error) {
    console.error("Error validating auth code:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
