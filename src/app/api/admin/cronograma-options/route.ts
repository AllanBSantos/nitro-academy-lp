import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

// GET - Buscar opções do enum do cronograma
export async function GET(_request: NextRequest) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Buscar schema do componente cronograma diretamente do Strapi
    // O Strapi expõe os schemas através da API do content-type-builder
    const componentUrl = `${STRAPI_API_URL}/api/content-type-builder/components/components.cronograma.cronograma`;
    
    const componentResponse = await fetch(componentUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      cache: "no-store",
    });

    if (componentResponse.ok) {
      const componentData = await componentResponse.json();
      const attributes = componentData.data?.attributes || componentData.attributes || {};
      
      const diaSemanaOptions = attributes.dia_semana?.enum || [];
      const horarioAulaOptions = attributes.horario_aula?.enum || [];

      // Remover prefixo "BRT " dos horários para exibição
      const horarios = horarioAulaOptions.map((horario: string) => 
        horario.replace(/^BRT\s+/, "")
      );

      return NextResponse.json({
        success: true,
        data: {
          diasSemana: diaSemanaOptions,
          horarios: horarios,
          horariosComBRT: horarioAulaOptions, // Manter formato original para envio
        },
      });
    }

    // Fallback para valores padrão se não conseguir buscar
    return NextResponse.json({
      success: true,
      data: {
        diasSemana: ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira"],
        horarios: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
        horariosComBRT: ["BRT 14:00", "BRT 15:00", "BRT 16:00", "BRT 17:00", "BRT 18:00", "BRT 19:00", "BRT 20:00"],
      },
    });
  } catch (error) {
    console.error("Erro ao buscar opções do cronograma:", error);
    // Retornar valores padrão em caso de erro
    return NextResponse.json({
      success: true,
      data: {
        diasSemana: ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira"],
        horarios: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
        horariosComBRT: ["BRT 14:00", "BRT 15:00", "BRT 16:00", "BRT 17:00", "BRT 18:00", "BRT 19:00", "BRT 20:00"],
      },
    });
  }
}

