export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number;
      height: number;
      formats: {
        thumbnail: {
          url: string;
          width: number;
          height: number;
        };
        small: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        large: {
          url: string;
          width: number;
          height: number;
        };
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string | null;
      provider: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider_metadata: any;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface Mentor {
  id: number;
  attributes: {
    nome: string;
    profissao: string;
    descricao: string;
    nota: number;
    avaliacoes: number;
    alunos: number;
    cursos: number;
    instagram: string;
    imagem: StrapiImage;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
  };
}

export interface Review {
  id: number;
  attributes: {
    nota: number;
    descricao: string;
    data: string;
    aluno: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
  };
}

export interface Course {
  id: number;
  titulo: string;
  descricao: string;
  nota: number | null;
  nivel: string;
  modelo: string;
  objetivo: string;
  pre_requisitos: string;
  cronograma: string;
  projetos: string;
  tarefa_de_casa: string;
  preco: number;
  parcelas: number;
  destaques: string | null;
  informacoes_adicionais: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  slug: string;
  link_pagamento: string | null;
  link_desconto: string | null;
  moeda: "Real" | "Dólar";
  badge: "dias_faltantes" | "poucos_dias" | "poucas_vagas" | null;
  competencias: string | null;
  ideal_para: string | null;
  sugestao_horario: boolean | null;
  imagem: {
    url: string;
  } | null;
  mentor: {
    nome: string;
    profissao: string | null;
    descricao: string;
    nota: number | null;
    avaliacoes: number | null;
    alunos: number | null;
    cursos: number | null;
    instagram: string;
    instagram_label: string;
    imagem: {
      url: string;
    } | null;
  } | null;
  tags: Array<{
    nome: string;
  }> | null;
  videos: Array<{
    titulo: string;
    descricao: string;
    video_url: string;
    video: {
      url: string;
    } | null;
  }> | null;
  cupons: Array<{
    id: number;
    documentId: string;
    nome: string;
    url: string | null;
    valido: boolean;
    validade: string | null;
    voucher_gratuito: boolean;
  }> | null;
  ementa_resumida: Array<{
    descricao: string;
  }> | null;
  resumo_aulas: Array<{
    nome_aula: string;
    descricao_aula: string;
  }> | null;
}
