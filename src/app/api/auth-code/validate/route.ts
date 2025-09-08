import { NextRequest, NextResponse } from "next/server";
import { formatInternationalPhone } from "@/lib/utils";

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

    // Log Zazu response for debugging
    console.log("Zazu API response:", {
      userType: data.userType,
      environment: process.env.NODE_ENV,
      whatsapp: formattedWhatsapp,
    });

    // For now, create a simple JWT token for WhatsApp users
    // This will allow them to access the protected routes
    const simpleJWT = createSimpleJWT(formattedWhatsapp);

    // Determine user type by searching in database first, then fallback to Zazu response
    const userType = data.userType || "new_user";

    // Always try to determine user type from database, regardless of Zazu response
    // This ensures consistency between local and production environments
    // We need to search in database even when Zazu returns a specific userType
    // to confirm the user exists and set isLinked properly

    // Try to find admin first
    const adminResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/admins?filters[celular][$eq]=${formattedWhatsapp}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      if (adminData.data && adminData.data.length > 0) {
        // Admin found, return with admin info immediately
        console.log("Found admin user:", {
          whatsapp: formattedWhatsapp,
          adminId: adminData.data[0].id,
        });
        return NextResponse.json({
          success: true,
          message: "Login realizado com sucesso",
          data: {
            whatsapp: formattedWhatsapp,
            userType: "admin",
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

    // Try to find mentor
    const mentorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/mentores?filters[celular][$eq]=${formattedWhatsapp}&locale=pt-BR`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (mentorResponse.ok) {
      const mentorData = await mentorResponse.json();
      if (mentorData.data && mentorData.data.length > 0) {
        // Mentor found, return with mentor info immediately
        console.log("Found mentor user:", {
          whatsapp: formattedWhatsapp,
          mentorId: mentorData.data[0].id,
        });
        return NextResponse.json({
          success: true,
          message: "Login realizado com sucesso",
          data: {
            whatsapp: formattedWhatsapp,
            userType: "mentor",
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

    // Try to find student
    const studentResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${formattedWhatsapp}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (studentResponse.ok) {
      const studentData = await studentResponse.json();
      console.log("Student search result:", {
        whatsapp: formattedWhatsapp,
        found: studentData.data?.length > 0,
        count: studentData.data?.length || 0,
        data: studentData.data,
      });
      if (studentData.data && studentData.data.length > 0) {
        // Student found, return with student info immediately
        console.log("Student found, returning linked response");
        return NextResponse.json({
          success: true,
          message: "Login realizado com sucesso",
          data: {
            whatsapp: formattedWhatsapp,
            userType: "student",
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
      } else {
        console.log(
          "Student not found in database, will return default response"
        );
      }
    }

    // If still not found, try without country code
    const withoutCountryCode = formattedWhatsapp.replace(/^55/, "");

    // Try admin without country code
    const adminResponse2 = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/admins?filters[celular][$eq]=${withoutCountryCode}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (adminResponse2.ok) {
      const adminData = await adminResponse2.json();
      if (adminData.data && adminData.data.length > 0) {
        console.log("Found admin user (without country code):", {
          whatsapp: withoutCountryCode,
          adminId: adminData.data[0].id,
        });
        return NextResponse.json({
          success: true,
          message: "Login realizado com sucesso",
          data: {
            whatsapp: formattedWhatsapp,
            userType: "admin",
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

    // Try mentor without country code
    const mentorResponse2 = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/mentores?filters[celular][$eq]=${withoutCountryCode}&locale=pt-BR`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (mentorResponse2.ok) {
      const mentorData = await mentorResponse2.json();
      if (mentorData.data && mentorData.data.length > 0) {
        console.log("Found mentor user (without country code):", {
          whatsapp: withoutCountryCode,
          mentorId: mentorData.data[0].id,
        });
        return NextResponse.json({
          success: true,
          message: "Login realizado com sucesso",
          data: {
            whatsapp: formattedWhatsapp,
            userType: "mentor",
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

    // Try student without country code
    const studentResponse2 = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/alunos?filters[telefone_aluno][$eq]=${withoutCountryCode}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (studentResponse2.ok) {
      const studentData = await studentResponse2.json();
      if (studentData.data && studentData.data.length > 0) {
        console.log("Found student user (without country code):", {
          whatsapp: withoutCountryCode,
          studentId: studentData.data[0].id,
        });
        return NextResponse.json({
          success: true,
          message: "Login realizado com sucesso",
          data: {
            whatsapp: formattedWhatsapp,
            userType: "student",
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

    // Log final user type determination
    console.log("Final user type determination:", {
      whatsapp: formattedWhatsapp,
      zazuUserType: data.userType,
      finalUserType: userType,
      environment: process.env.NODE_ENV,
    });

    // Default response (for new_user or if linking failed)
    // If we still couldn't determine user type, it means the user is truly new
    console.log("Returning default response:", {
      whatsapp: formattedWhatsapp,
      userType,
      zazuUserType: data.userType,
      environment: process.env.NODE_ENV,
    });

    return NextResponse.json({
      success: true,
      message: "Código validado com sucesso",
      data: {
        whatsapp: formattedWhatsapp,
        userType: userType === "new_user" ? "new_user" : userType,
        token: simpleJWT,
        user: {
          id: 999, // Temporary ID for WhatsApp users
          username: `user_${formattedWhatsapp}`,
          email: `${formattedWhatsapp}@whatsapp.user`,
        },
        // Add debug info for production troubleshooting
        debug: {
          zazuUserType: data.userType,
          determinedUserType: userType,
          environment: process.env.NODE_ENV,
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
