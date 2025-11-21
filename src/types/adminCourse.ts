export interface AdminCourseMentor {
  id: number;
  documentId?: string;
  nome: string;
  descricao: string;
  pais: string;
  instagram: string;
  instagram_label: string;
  linkedin_url: string;
  linkedin_label: string;
  imagemId: string;
  imagemUrl: string;
}

export interface AdminCourseDetails {
  habilitado: boolean;
  titulo: string;
  descricao: string;
  data_inicio_curso: string;
  sugestao_horario: boolean;
  pre_requisitos: string;
  competencias: string;
  projetos: string;
  tarefa_de_casa: string;
  videos: Array<{
    titulo: string;
    video_url: string;
  }>;
  ementa_resumida: Array<{
    descricao: string;
  }>;
  resumo_aulas: Array<{
    nome_aula: string;
    descricao_aula: string;
  }>;
  mentor: AdminCourseMentor | null;
}

