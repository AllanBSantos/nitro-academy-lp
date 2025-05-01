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

export interface CardProps {
  id: string;
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
  price: {
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
  topicosRelacionados: string[];
  videos: Video[];
  cronograma: Schedule[];
  moeda: "Real" | "Dólar";
  cupons: {
    id: number;
    documentId: string;
    nome: string;
    url: string | null;
    valido: boolean;
    validade: string | null;
  }[];
  badge: "dias_faltantes" | "poucos_dias" | "poucas_vagas" | null;
}
