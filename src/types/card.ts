export interface Video {
  titulo: string;
  descricao: string;
  video_url: string;
  video: {
    url: string;
  } | null;
}

export interface Schedule {
  dia: string;
  horario: string;
  data_inicio: string;
  data_fim?: string;
  faixa_etaria: string;
}

export interface Turma {
  id: string;
  horario: string;
  vagas_disponiveis: number;
  faixa_etaria: string;
  data_inicio: string;
  data_fim?: string;
}

export interface CardProps {
  id: string;
  documentId: string;
  slug: string;
  title: string;
  description: string;
  mentor: {
    name: string;
    image: string;
    students: number;
    courses: number;
    profissao: string;
    nota: number;
    avaliacoes: number;
    descricao: string;
    instagram: string;
    instagram_label: string;
  };
  rating: number | null;
  price?: {
    installment: number;
    total: number;
    installments: number;
  };
  image: string;
  nivel: string;
  modelo: string;
  objetivo: string;
  pre_requisitos: string;
  projetos: string;
  tarefa_de_casa: string;
  informacoes_adicionais: string;
  link_pagamento: string;
  link_desconto: string | null;
  inscricoes_abertas: boolean;
  topicosRelacionados: string[];
  videos: Video[];
  cronograma: Schedule[];
  moeda?: "Real" | "Dólar";
  badge?: "dias_faltantes" | "poucos_dias" | "poucas_vagas" | "nenhum";
  cupons: Array<{
    id: number;
    documentId: string;
    nome: string;
    url: string | null;
    valido: boolean;
    validade: string | null;
    voucher_gratuito: boolean;
  }>;
  competencias?: string;
  ideal_para?: string;
  ementa_resumida?: Array<{
    descricao: string;
  }>;
  resumo_aulas?: Array<{
    nome_aula: string;
    descricao_aula: string;
  }>;
  sugestao_horario?: boolean;
  turmas?: Turma[];
  alunos?: { id: number; turma?: number }[];
  data_inicio_curso?: string;
}
