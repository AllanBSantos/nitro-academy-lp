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
  imagem: {
    url: string;
  };
  nivel: string;
  modelo: string;
  objetivo: string;
  nota: number;
  pre_requisitos: string;
  projetos: string;
  tarefa_de_casa: string;
  preco: number;
  parcelas: number;
  destaques: string;
  mentor: {
    nome: string;
    imagem: {
      url: string;
    };
    alunos: number;
    cursos: number;
  };
  avaliacoes: Review[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}
