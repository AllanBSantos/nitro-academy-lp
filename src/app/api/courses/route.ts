import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const ADMIN_TOKEN = process.env.STRAPI_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    if (!STRAPI_API_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Sempre usar pt-BR hardcoded (não importa o que vier no parâmetro)
    const locale = "pt-BR";

    // URL para buscar cursos com todos os dados necessários
    // IMPORTANTE: Mantém filtro habilitado=true conforme solicitado
    // Populando alunos com filtro habilitado=true para contar apenas alunos habilitados
    const url = `${STRAPI_API_URL}/api/cursos?filters[habilitado][$eq]=true&locale=${locale}&populate[cronograma][fields][0]=dia_semana&populate[cronograma][fields][1]=horario_aula&populate[cronograma][fields][2]=data_inicio&populate[alunos][filters][habilitado][$eq]=true&populate[alunos][fields][0]=id&populate[alunos][fields][1]=turma&populate[campanhas][fields][0]=id&populate[campanhas][fields][1]=nome&populate[campanhas][fields][2]=createdAt&populate[mentor][fields][0]=nome&populate[mentor][fields][1]=profissao&populate[mentor][fields][2]=descricao&populate[mentor][fields][3]=alunos&populate[mentor][fields][4]=cursos&populate[mentor][fields][5]=instagram&populate[mentor][fields][6]=instagram_label&populate[mentor][fields][7]=linkedin_url&populate[mentor][fields][8]=linkedin_label&populate[mentor][fields][9]=pais&populate[mentor][populate][imagem][fields][0]=url&populate[mentor][populate][reviews]=*&populate[imagem][fields][0]=url&populate[tags][fields][0]=nome&fields[0]=id&fields[1]=titulo&fields[2]=descricao&fields[3]=nota&fields[4]=nivel&fields[5]=modelo&fields[6]=pre_requisitos&fields[7]=projetos&fields[8]=tarefa_de_casa&fields[9]=preco&fields[10]=parcelas&fields[11]=slug&fields[12]=link_pagamento&fields[13]=moeda&fields[14]=informacoes_adicionais&fields[15]=badge&fields[16]=link_desconto&fields[17]=competencias&fields[18]=sugestao_horario&fields[19]=inscricoes_abertas&fields[20]=data_inicio_curso&fields[21]=lingua&fields[22]=aviso_matricula&fields[23]=plano&sort=createdAt:desc`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[Courses API] Strapi response error: ${response.status} ${response.statusText}`,
        errorText
      );
      return NextResponse.json(
        { error: "Erro ao buscar cursos" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
