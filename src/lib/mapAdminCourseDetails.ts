import { AdminCourseDetails, AdminCourseMentor } from "@/types/adminCourse";
import { normalizeStrapiImageUrl } from "@/lib/utils";

type RawMedia = {
  id?: number;
  url?: string;
  attributes?: {
    id?: number;
    url?: string;
    formats?: {
      small?: { url?: string };
      thumbnail?: { url?: string };
    };
  };
  data?: {
    id?: number;
    attributes?: {
      id?: number;
      url?: string;
      formats?: {
        small?: { url?: string };
        thumbnail?: { url?: string };
      };
    };
  };
} | null;

type RawMentor = {
  id?: number;
  documentId?: string;
  attributes?: RawMentor;
  nome?: string;
  descricao?: string;
  pais?: string;
  instagram?: string;
  instagram_label?: string;
  linkedin_url?: string;
  linkedin_label?: string;
  imagem?: RawMedia | { data?: RawMedia };
};

type RawMentorRelation =
  | { data?: RawMentor | null }
  | RawMentor
  | null
  | undefined;

type RawVideo = {
  titulo?: string | null;
  video_url?: string | null;
};

type RawEmenta = {
  descricao?: string | null;
};

type RawResumo = {
  nome_aula?: string | null;
  descricao_aula?: string | null;
};

type RawCourse = {
  id?: number;
  documentId?: string;
  attributes?: RawCourseAttributes;
} & RawCourseAttributes;

type RawCourseAttributes = {
  titulo?: string;
  descricao?: string;
  data_inicio_curso?: string;
  sugestao_horario?: boolean;
  pre_requisitos?: string;
  competencias?: string;
  projetos?: string;
  tarefa_de_casa?: string;
  videos?: RawVideo[];
  ementa_resumida?: RawEmenta[];
  resumo_aulas?: RawResumo[];
  mentor?: RawMentorRelation;
  habilitado?: boolean;
};

const normalizeMedia = (media?: RawMedia): { id: string; url: string } => {
  if (!media) {
    return { id: "", url: "" };
  }

  const id =
    media.id ??
    media.attributes?.id ??
    media.data?.id ??
    media.data?.attributes?.id ??
    "";

  const url =
    media.url ||
    media.attributes?.url ||
    media.data?.attributes?.url ||
    media.attributes?.formats?.small?.url ||
    media.attributes?.formats?.thumbnail?.url ||
    media.data?.attributes?.formats?.small?.url ||
    media.data?.attributes?.formats?.thumbnail?.url ||
    "";

  return {
    id: id ? String(id) : "",
    url: url || "",
  };
};

export const mapStrapiCourseToAdminDetails = (
  courseData: RawCourse
): AdminCourseDetails => {
  const attributes: RawCourse = courseData.attributes
    ? {
        id: courseData.id,
        documentId: courseData.documentId,
        ...courseData.attributes,
      }
    : courseData;

  const mentorRelation = attributes.mentor as RawMentorRelation;
  const mentorRaw =
    (mentorRelation && typeof mentorRelation === "object" && "data" in mentorRelation
      ? mentorRelation.data
      : mentorRelation) || null;

  let mentor: AdminCourseMentor | null = null;
  if (mentorRaw) {
    const mentorData = mentorRaw as RawMentor;
    const mentorAttributes = mentorData.attributes
      ? { id: mentorData.id, documentId: mentorData.documentId, ...mentorData.attributes }
      : mentorData;
    const imagemData = mentorAttributes.imagem as RawMedia | { data?: RawMedia } | undefined;
    const normalizedImage = normalizeMedia(
      (imagemData && typeof imagemData === "object" && "data" in imagemData
        ? imagemData.data
        : (imagemData as RawMedia)) || null
    );

    mentor = {
      id: mentorAttributes.id || mentorData.id || 0,
      documentId: mentorAttributes.documentId || mentorData.documentId,
      nome: mentorAttributes.nome || "",
      descricao: mentorAttributes.descricao || "",
      pais: mentorAttributes.pais || "",
      instagram: mentorAttributes.instagram || "",
      instagram_label: mentorAttributes.instagram_label || "",
      linkedin_url: mentorAttributes.linkedin_url || "",
      linkedin_label: mentorAttributes.linkedin_label || "",
      imagemId: normalizedImage.id,
      imagemUrl: normalizeStrapiImageUrl(normalizedImage.url),
    };
  }

  const videosArray = Array.isArray(attributes.videos)
    ? (attributes.videos as RawVideo[])
    : [];
  const ementaArray = Array.isArray(attributes.ementa_resumida)
    ? (attributes.ementa_resumida as RawEmenta[])
    : [];
  const resumoArray = Array.isArray(attributes.resumo_aulas)
    ? (attributes.resumo_aulas as RawResumo[])
    : [];

  return {
    habilitado: Boolean(attributes.habilitado),
    titulo: attributes.titulo || "",
    descricao: attributes.descricao || "",
    data_inicio_curso: attributes.data_inicio_curso || "",
    sugestao_horario: Boolean(attributes.sugestao_horario),
    pre_requisitos: attributes.pre_requisitos || "",
    competencias: attributes.competencias || "",
    projetos: attributes.projetos || "",
    tarefa_de_casa: attributes.tarefa_de_casa || "",
    videos: videosArray.map((video: RawVideo) => ({
      titulo: video?.titulo || "",
      video_url: video?.video_url || "",
    })),
    ementa_resumida: ementaArray.map((item: RawEmenta) => ({
      descricao: item?.descricao || "",
    })),
    resumo_aulas: resumoArray.map((item: RawResumo) => ({
      nome_aula: item?.nome_aula || "",
      descricao_aula: item?.descricao_aula || "",
    })),
    mentor,
  };
};

