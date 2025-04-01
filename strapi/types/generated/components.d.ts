import type { Schema, Struct } from '@strapi/strapi';

export interface ProjectsProjects extends Struct.ComponentSchema {
  collectionName: 'components_projects_projects';
  info: {
    displayName: 'projects';
  };
  attributes: {
    descricao: Schema.Attribute.Text;
    destaque: Schema.Attribute.Text;
    imagem: Schema.Attribute.Media<'images'>;
    info_adicional: Schema.Attribute.Text;
    licao_casa: Schema.Attribute.Text;
    mentor: Schema.Attribute.String;
    mentor_link: Schema.Attribute.String;
    modelo_aula: Schema.Attribute.Text;
    nivel: Schema.Attribute.String;
    objetivo: Schema.Attribute.Text;
    pre_requisitos: Schema.Attribute.Text;
    projetos: Schema.Attribute.Text;
    titulo: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'projects.projects': ProjectsProjects;
    }
  }
}
