import { NextRequest, NextResponse } from "next/server";
import { formatInternationalPhone } from "@/lib/utils";

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3;

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  authCodeRateLimit?: Map<string, RateLimitEntry>;
};

if (!globalForRateLimit.authCodeRateLimit) {
  globalForRateLimit.authCodeRateLimit = new Map();
}

const rateLimitStore = globalForRateLimit.authCodeRateLimit;

function isRateLimited(identifier: string): boolean {
  if (!identifier) {
    return false;
  }

  const now = Date.now();
  const entry = rateLimitStore?.get(identifier);

  if (!entry || entry.expiresAt <= now) {
    rateLimitStore?.set(identifier, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  rateLimitStore?.set(identifier, entry);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.ip ||
      "unknown";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Muitas tentativas de envio de código. Tente novamente em instantes.",
        },
        { status: 429 }
      );
    }

    const { whatsapp } = await request.json();

    if (!whatsapp) {
      return NextResponse.json(
        { error: "Número de WhatsApp é obrigatório" },
        { status: 400 }
      );
    }

    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    if (cleanWhatsapp.length < 8 || cleanWhatsapp.length > 15) {
      return NextResponse.json(
        { error: "Número de WhatsApp inválido" },
        { status: 400 }
      );
    }

    // Rate-limit também por número para evitar spam em um mesmo contato
    if (isRateLimited(`wa:${cleanWhatsapp}`)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Muitas tentativas para esse número. Aguarde um minuto antes de tentar novamente.",
        },
        { status: 429 }
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

    const requestBody = {
      whatsappNumber: formattedWhatsapp,
    };

    const response = await fetch(`${ZAZU_URL}/auth-code/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.error || "Erro ao criar código de autenticação",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Código enviado com sucesso",
      data: data,
    });
  } catch (error) {
    console.error("Error creating auth code:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
