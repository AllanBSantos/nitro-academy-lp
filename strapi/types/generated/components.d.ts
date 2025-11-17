import type { Schema, Struct } from '@strapi/strapi';

export interface ComentarioAlunoComentarioAluno extends Struct.ComponentSchema {
  collectionName: 'components_comentario_aluno_comentario_alunos';
  info: {
    description: '';
    displayName: 'comentario_aluno';
  };
  attributes: {
    aluno: Schema.Attribute.Relation<'oneToOne', 'api::aluno.aluno'>;
    comentario: Schema.Attribute.Text;
    spinners_aula: Schema.Attribute.Integer;
  };
}

export interface ComponentesDiasDaSemana extends Struct.ComponentSchema {
  collectionName: 'components_componentes_dias_da_semanas';
  info: {
    displayName: 'dias_da_semana';
  };
  attributes: {
    dia_da_semana: Schema.Attribute.String;
  };
}

export interface ComponentesEmendaResumida extends Struct.ComponentSchema {
  collectionName: 'components_componentes_emenda_resumidas';
  info: {
    description: '';
    displayName: 'emenda_resumida';
  };
  attributes: {
    descricao: Schema.Attribute.String;
  };
}

export interface ComponentesResumoAulas extends Struct.ComponentSchema {
  collectionName: 'components_componentes_resumo_aulas';
  info: {
    displayName: 'resumo_aulas';
  };
  attributes: {
    descricao_aula: Schema.Attribute.String;
    nome_aula: Schema.Attribute.String;
  };
}

export interface CronogramaCronograma extends Struct.ComponentSchema {
  collectionName: 'components_cronograma_cronogramas';
  info: {
    description: '';
    displayName: 'cronograma';
  };
  attributes: {
    data_fim: Schema.Attribute.Date;
    data_inicio: Schema.Attribute.Date;
    dia_semana: Schema.Attribute.Enumeration<
      [
        'Segunda-Feira',
        'Ter\u00E7a-Feira',
        'Quarta-Feira',
        'Quinta-Feira',
        'Sexta-Feira',
      ]
    >;
    horario_aula: Schema.Attribute.Enumeration<
      [
        'BRT 14:00',
        'BRT 15:00',
        'BRT 16:00',
        'BRT 17:00',
        'BRT 18:00',
        'BRT 19:00',
        'BRT 20:00',
      ]
    >;
    link_aula: Schema.Attribute.String;
  };
}

export interface ReviewReview extends Struct.ComponentSchema {
  collectionName: 'components_review_reviews';
  info: {
    displayName: 'review';
  };
  attributes: {
    descricao: Schema.Attribute.Text;
    nome: Schema.Attribute.String;
    nota: Schema.Attribute.Integer;
  };
}

export interface TagsTags extends Struct.ComponentSchema {
  collectionName: 'components_tags_tags';
  info: {
    displayName: 'tags';
  };
  attributes: {
    nome: Schema.Attribute.String;
  };
}

export interface VideosVideos extends Struct.ComponentSchema {
  collectionName: 'components_videos_videos';
  info: {
    description: '';
    displayName: 'videos';
  };
  attributes: {
    descricao: Schema.Attribute.Text;
    titulo: Schema.Attribute.String;
    video: Schema.Attribute.Media<'videos'>;
    video_url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'comentario-aluno.comentario-aluno': ComentarioAlunoComentarioAluno;
      'componentes.dias-da-semana': ComponentesDiasDaSemana;
      'componentes.emenda-resumida': ComponentesEmendaResumida;
      'componentes.resumo-aulas': ComponentesResumoAulas;
      'cronograma.cronograma': CronogramaCronograma;
      'review.review': ReviewReview;
      'tags.tags': TagsTags;
      'videos.videos': VideosVideos;
    }
  }
}
