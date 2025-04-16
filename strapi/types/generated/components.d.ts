import type { Schema, Struct } from '@strapi/strapi';

export interface CronogramaCronograma extends Struct.ComponentSchema {
  collectionName: 'components_cronograma_cronogramas';
  info: {
    description: '';
    displayName: 'cronograma';
  };
  attributes: {
    data_fim: Schema.Attribute.Date;
    data_inicio: Schema.Attribute.Date;
    dia: Schema.Attribute.String;
    faixa_etaria: Schema.Attribute.String;
    horario: Schema.Attribute.String;
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
      'cronograma.cronograma': CronogramaCronograma;
      'tags.tags': TagsTags;
      'videos.videos': VideosVideos;
    }
  }
}
