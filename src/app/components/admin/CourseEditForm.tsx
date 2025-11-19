import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Trash2, UploadCloud, Loader2, User } from "lucide-react";
import { AdminCourseDetails, AdminCourseMentor } from "@/types/adminCourse";
import { normalizeStrapiImageUrl } from "@/lib/utils";

interface Video {
  titulo: string;
  video_url: string;
}

interface EmentaResumida {
  descricao: string;
}

interface ResumoAula {
  nome_aula: string;
  descricao_aula: string;
}

type MentorFormState = AdminCourseMentor;
type FormState = AdminCourseDetails;

interface CourseEditFormProps {
  course: AdminCourseDetails;
  documentId: string;
  onUpdateSuccess?: () => void;
}

const LABELS: Record<string, string> = {
  habilitado: "Habilitado",
  titulo: "Título",
  descricao: "Descrição",
  data_inicio_curso: "Data Início Curso",
  sugestao_horario: "Sugestão Horário",
  pre_requisitos: "Pré-requisitos",
  competencias: "Competências",
  projetos: "Projetos",
  tarefa_de_casa: "Atividades Semanais",
  videos: "Vídeos",
  video_url: "Video Url",
  ementa_resumida: "Ementa Resumida",
  resumo_aulas: "Resumo Aulas",
  nome_aula: "Nome da Aula",
  descricao_aula: "Descrição da Aula",
  nome: "Nome",
  descricaoMentor: "Descrição",
  pais: "País",
  instagram: "Instagram Url",
  instagram_label: "Instagram Label",
  linkedin_url: "Linkedin Url",
  linkedin_label: "Linkedin Label",
  imagem: "Imagem",
};

const defaultVideo: Video = { titulo: "", video_url: "" };
const defaultEmenta: EmentaResumida = { descricao: "" };
const defaultResumo: ResumoAula = { nome_aula: "", descricao_aula: "" };

const labelFor = (field: string) =>
  LABELS[field] ||
  field
    .split("_")
    .map(
      (segment) => (segment.charAt(0).toUpperCase() || "") + segment.slice(1)
    )
    .join(" ");

const normalizeDateValue = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const sliced = value.split("T")[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(sliced) ? sliced : "";
};

const sanitizeVideos = (videos: Video[]) =>
  videos
    .map((video) => ({
      titulo: video.titulo?.trim() ?? "",
      video_url: video.video_url?.trim() ?? "",
    }))
    .filter((video) => video.titulo || video.video_url);

const sanitizeEmenta = (items: EmentaResumida[]) =>
  items
    .map((item) => ({ descricao: item.descricao?.trim() ?? "" }))
    .filter((item) => item.descricao);

const sanitizeResumo = (items: ResumoAula[]) =>
  items
    .map((item) => ({
      nome_aula: item.nome_aula?.trim() ?? "",
      descricao_aula: item.descricao_aula?.trim() ?? "",
    }))
    .filter((item) => item.nome_aula || item.descricao_aula);

const arraysEqual = <T,>(a: T[], b: T[]) =>
  JSON.stringify(a) === JSON.stringify(b);

const buildInitialState = (course: AdminCourseDetails): FormState => {
  const mentorData = course.mentor;
  const mentor: MentorFormState | null = mentorData
    ? {
        id: mentorData.id,
        documentId: mentorData.documentId,
        nome: mentorData.nome,
        descricao: mentorData.descricao,
        pais: mentorData.pais,
        instagram: mentorData.instagram,
        instagram_label: mentorData.instagram_label,
        linkedin_url: mentorData.linkedin_url,
        linkedin_label: mentorData.linkedin_label,
        imagemId: mentorData.imagemId,
        imagemUrl: mentorData.imagemUrl,
      }
    : null;

  return {
    habilitado: Boolean(course.habilitado),
    titulo: course.titulo || "",
    descricao: course.descricao || "",
    data_inicio_curso: normalizeDateValue(course.data_inicio_curso),
    sugestao_horario: Boolean(course.sugestao_horario),
    pre_requisitos: course.pre_requisitos || "",
    competencias: course.competencias || "",
    projetos: course.projetos || "",
    tarefa_de_casa: course.tarefa_de_casa || "",
    videos:
      Array.isArray(course.videos) && course.videos.length > 0
        ? course.videos.map((video: Video) => ({
            titulo: video.titulo || "",
            video_url: video.video_url || "",
          }))
        : [defaultVideo],
    ementa_resumida:
      Array.isArray(course.ementa_resumida) && course.ementa_resumida.length > 0
        ? course.ementa_resumida.map((item: EmentaResumida) => ({
            descricao: item.descricao || "",
          }))
        : [defaultEmenta],
    resumo_aulas:
      Array.isArray(course.resumo_aulas) && course.resumo_aulas.length > 0
        ? course.resumo_aulas.map((item: ResumoAula) => ({
            nome_aula: item.nome_aula || "",
            descricao_aula: item.descricao_aula || "",
          }))
        : [defaultResumo],
    mentor,
  };
};

const buildCoursePayload = (form: FormState, reference: AdminCourseDetails) => {
  const payload: Record<string, unknown> = {};
  if (Boolean(reference.habilitado) !== form.habilitado) {
    payload.habilitado = form.habilitado;
  }
  if ((reference.titulo || "") !== form.titulo) {
    payload.titulo = form.titulo;
  }
  if ((reference.descricao || "") !== form.descricao) {
    payload.descricao = form.descricao;
  }
  if (
    normalizeDateValue(reference.data_inicio_curso) !== form.data_inicio_curso
  ) {
    payload.data_inicio_curso = form.data_inicio_curso || null;
  }
  if (Boolean(reference.sugestao_horario) !== form.sugestao_horario) {
    payload.sugestao_horario = form.sugestao_horario;
  }
  if ((reference.pre_requisitos || "") !== form.pre_requisitos) {
    payload.pre_requisitos = form.pre_requisitos;
  }
  if ((reference.competencias || "") !== form.competencias) {
    payload.competencias = form.competencias;
  }
  if ((reference.projetos || "") !== form.projetos) {
    payload.projetos = form.projetos;
  }
  if ((reference.tarefa_de_casa || "") !== form.tarefa_de_casa) {
    payload.tarefa_de_casa = form.tarefa_de_casa;
  }

  const sanitizedVideos = sanitizeVideos(form.videos);
  const referenceVideos = sanitizeVideos(reference.videos || []);
  if (!arraysEqual(sanitizedVideos, referenceVideos)) {
    payload.videos = sanitizedVideos;
  }

  const sanitizedEmenta = sanitizeEmenta(form.ementa_resumida);
  const referenceEmenta = sanitizeEmenta(reference.ementa_resumida || []);
  if (!arraysEqual(sanitizedEmenta, referenceEmenta)) {
    payload.ementa_resumida = sanitizedEmenta;
  }

  const sanitizedResumo = sanitizeResumo(form.resumo_aulas);
  const referenceResumo = sanitizeResumo(reference.resumo_aulas || []);
  if (!arraysEqual(sanitizedResumo, referenceResumo)) {
    payload.resumo_aulas = sanitizedResumo;
  }

  return payload;
};

const buildMentorPayload = (
  mentorForm: MentorFormState | null,
  referenceMentor: AdminCourseDetails["mentor"]
) => {
  if (!mentorForm || !referenceMentor || !mentorForm.id) {
    return null;
  }

  const payload: Record<string, unknown> = {};

  if ((referenceMentor.nome || "") !== mentorForm.nome) {
    payload.nome = mentorForm.nome;
  }
  if ((referenceMentor.descricao || "") !== mentorForm.descricao) {
    payload.descricao = mentorForm.descricao;
  }
  if ((referenceMentor.pais || "") !== mentorForm.pais) {
    payload.pais = mentorForm.pais;
  }
  if ((referenceMentor.instagram || "") !== mentorForm.instagram) {
    payload.instagram = mentorForm.instagram;
  }
  if ((referenceMentor.instagram_label || "") !== mentorForm.instagram_label) {
    payload.instagram_label = mentorForm.instagram_label;
  }
  if ((referenceMentor.linkedin_url || "") !== mentorForm.linkedin_url) {
    payload.linkedin_url = mentorForm.linkedin_url;
  }
  if ((referenceMentor.linkedin_label || "") !== mentorForm.linkedin_label) {
    payload.linkedin_label = mentorForm.linkedin_label;
  }

  const referenceImageId = referenceMentor.imagemId
    ? Number(referenceMentor.imagemId) || null
    : null;
  const trimmedImageId = mentorForm.imagemId.trim();
  if (!trimmedImageId && referenceImageId !== null) {
    payload.imagem = null;
  } else if (trimmedImageId) {
    const parsedImageId = Number(trimmedImageId);
    const normalizedImageId = Number.isNaN(parsedImageId)
      ? null
      : parsedImageId;
    if (normalizedImageId !== referenceImageId) {
      payload.imagem = normalizedImageId;
    }
  }

  return Object.keys(payload).length ? payload : null;
};

export default function CourseEditForm({
  course,
  documentId,
  onUpdateSuccess,
}: CourseEditFormProps) {
  const t = useTranslations("Admin.panel");
  const [formState, setFormState] = useState<FormState>(() =>
    buildInitialState(course)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mentorImageUploading, setMentorImageUploading] = useState(false);
  const [mentorImageError, setMentorImageError] = useState<string | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ref para rastrear se estamos em um estado de sucesso ativo
  const isSuccessActiveRef = useRef(false);

  useEffect(() => {
    // Só atualizar o formState se não houver uma mensagem de sucesso ativa
    // Isso evita que o re-render após salvar resete a mensagem de sucesso
    if (!isSuccessActiveRef.current) {
      setFormState(buildInitialState(course));
    }
  }, [course]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const updateFormField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateVideoField = (
    index: number,
    field: keyof Video,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      videos: prev.videos.map((video, idx) =>
        idx === index ? { ...video, [field]: value } : video
      ),
    }));
  };

  const addVideo = () =>
    setFormState((prev) => ({
      ...prev,
      videos: [...prev.videos, { ...defaultVideo }],
    }));

  const removeVideo = (index: number) =>
    setFormState((prev) => {
      const updated = prev.videos.filter((_, idx) => idx !== index);
      return {
        ...prev,
        videos: updated.length ? updated : [{ ...defaultVideo }],
      };
    });

  const updateEmentaField = (index: number, value: string) =>
    setFormState((prev) => ({
      ...prev,
      ementa_resumida: prev.ementa_resumida.map((item, idx) =>
        idx === index ? { descricao: value } : item
      ),
    }));

  const addEmenta = () =>
    setFormState((prev) => ({
      ...prev,
      ementa_resumida: [...prev.ementa_resumida, { ...defaultEmenta }],
    }));

  const removeEmenta = (index: number) =>
    setFormState((prev) => {
      const updated = prev.ementa_resumida.filter((_, idx) => idx !== index);
      return {
        ...prev,
        ementa_resumida: updated.length ? updated : [{ ...defaultEmenta }],
      };
    });

  const updateResumoField = (
    index: number,
    field: keyof ResumoAula,
    value: string
  ) =>
    setFormState((prev) => ({
      ...prev,
      resumo_aulas: prev.resumo_aulas.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));

  const addResumo = () =>
    setFormState((prev) => ({
      ...prev,
      resumo_aulas: [...prev.resumo_aulas, { ...defaultResumo }],
    }));

  const removeResumo = (index: number) =>
    setFormState((prev) => {
      const updated = prev.resumo_aulas.filter((_, idx) => idx !== index);
      return {
        ...prev,
        resumo_aulas: updated.length ? updated : [{ ...defaultResumo }],
      };
    });

  const updateMentorField = (field: keyof MentorFormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      mentor: prev.mentor ? { ...prev.mentor, [field]: value } : prev.mentor,
    }));
  };

  const handleToggle = (field: "habilitado" | "sugestao_horario") => () => {
    updateFormField(field, !formState[field]);
  };

  const handleMentorImageDelete = () => {
    setMentorImageError(null);
    updateMentorField("imagemId", "");
    updateMentorField("imagemUrl", "");
  };

  const handleMentorImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMentorImageError(null);
    setMentorImageUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/admin/mentor-image-upload", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.error || "Falha ao enviar imagem. Tente novamente."
        );
      }
      const payload = await response.json();
      const normalizedUrl = normalizeStrapiImageUrl(payload.url || "");
      updateMentorField("imagemId", String(payload.id));
      updateMentorField("imagemUrl", normalizedUrl);
    } catch (error) {
      console.error("Error uploading mentor image:", error);
      setMentorImageError(
        error instanceof Error
          ? error.message
          : "Falha ao enviar imagem. Tente novamente."
      );
    } finally {
      setMentorImageUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const coursePayload = buildCoursePayload(formState, course);
      const mentorPayload = buildMentorPayload(formState.mentor, course.mentor);

      if (
        (!coursePayload || Object.keys(coursePayload).length === 0) &&
        !mentorPayload
      ) {
        setSubmitError(t("course_edit.no_changes"));
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`/api/admin/course-details/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseData:
            coursePayload && Object.keys(coursePayload).length > 0
              ? coursePayload
              : undefined,
          mentorData:
            mentorPayload && formState.mentor
              ? {
                  mentorId: formState.mentor.id,
                  mentorDocumentId: formState.mentor.documentId,
                  data: mentorPayload,
                }
              : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || t("course_edit.error_saving"));
      }

      setSubmitSuccess(true);
      setSubmitError(null);
      isSuccessActiveRef.current = true;

      // Limpar timeout anterior se existir
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      // Esconder mensagem após 5 segundos E recarregar dados
      // IMPORTANTE: Não recarregar dados antes, pois isso causa re-render e reseta o estado
      successTimeoutRef.current = setTimeout(() => {
        setSubmitSuccess(false);
        isSuccessActiveRef.current = false;
        successTimeoutRef.current = null;
        // Recarregar dados APÓS esconder a mensagem
        onUpdateSuccess?.();
      }, 5000);
    } catch (error) {
      console.error("Error updating course details:", error);
      setSubmitError(
        error instanceof Error ? error.message : t("course_edit.error_saving")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Header com botão de salvar */}
      <div className="flex items-center justify-end mb-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-6 py-2 rounded font-semibold transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? t("course_edit.saving") : t("course_edit.save")}
        </button>
      </div>

      {/* Mensagens de erro e sucesso */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 animate-in fade-in duration-300">
          {t("course_edit.success")}
        </div>
      )}

      <section className="space-y-6">
        <div className="grid gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-800 mb-1">
                  {labelFor("habilitado")}
                </label>
                <p className="text-sm text-gray-600">
                  {t("course_edit.enable_description")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formState.habilitado}
                onClick={handleToggle("habilitado")}
                className="flex-shrink-0"
              >
                <span
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formState.habilitado ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formState.habilitado ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-800 mb-1">
                  {labelFor("sugestao_horario")}
                </label>
                <p className="text-sm text-gray-600">
                  {t("course_edit.schedule_suggestion_description")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formState.sugestao_horario}
                onClick={handleToggle("sugestao_horario")}
                className="flex-shrink-0"
              >
                <span
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formState.sugestao_horario ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formState.sugestao_horario
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-800">
              {labelFor("titulo")}
            </label>
            <input
              className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              value={formState.titulo}
              onChange={(event) =>
                updateFormField("titulo", event.target.value)
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-800">
              {labelFor("descricao")}
            </label>
            <textarea
              className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              value={formState.descricao}
              onChange={(event) =>
                updateFormField("descricao", event.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                {labelFor("data_inicio_curso")}
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                value={formState.data_inicio_curso}
                onChange={(event) =>
                  updateFormField("data_inicio_curso", event.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                {labelFor("pre_requisitos")}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formState.pre_requisitos}
                onChange={(event) =>
                  updateFormField("pre_requisitos", event.target.value)
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                {labelFor("competencias")}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formState.competencias}
                onChange={(event) =>
                  updateFormField("competencias", event.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                {labelFor("projetos")}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formState.projetos}
                onChange={(event) =>
                  updateFormField("projetos", event.target.value)
                }
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                {labelFor("tarefa_de_casa")}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formState.tarefa_de_casa}
                onChange={(event) =>
                  updateFormField("tarefa_de_casa", event.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-3 text-gray-800">
              {labelFor("videos")}
            </label>
            {formState.videos.map((video, idx) => (
              <div
                key={`video-${idx}`}
                className="flex flex-col md:flex-row gap-2 mb-3 items-end"
              >
                <div className="flex-1">
                  <label className="block font-semibold mb-1 text-gray-800 text-sm">
                    {labelFor("video_url")}
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={labelFor("video_url")}
                    value={video.video_url}
                    onChange={(event) =>
                      updateVideoField(idx, "video_url", event.target.value)
                    }
                  />
                </div>
                {formState.videos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
                    className="text-red-500 hover:text-red-600 mb-1"
                    aria-label={t("course_edit.remove_video")}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addVideo}
              className="text-blue-600 font-semibold"
            >
              + {t("course_edit.add_video")}
            </button>
          </div>

          <div>
            <label className="block font-semibold mb-3 text-gray-800">
              {labelFor("ementa_resumida")}
            </label>
            {formState.ementa_resumida.map((item, idx) => (
              <div key={`ementa-${idx}`} className="flex gap-2 mb-3">
                <input
                  className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={labelFor("descricao")}
                  value={item.descricao}
                  onChange={(event) =>
                    updateEmentaField(idx, event.target.value)
                  }
                />
                {formState.ementa_resumida.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmenta(idx)}
                    className="text-red-500 hover:text-red-600"
                    aria-label={t("course_edit.remove_ementa")}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEmenta}
              className="text-blue-600 font-semibold"
            >
              + {t("course_edit.add_ementa")}
            </button>
          </div>

          <div>
            <label className="block font-semibold mb-3 text-gray-800">
              {labelFor("resumo_aulas")}
            </label>
            {formState.resumo_aulas.map((item, idx) => (
              <div
                key={`resumo-${idx}`}
                className="flex flex-col md:flex-row gap-2 mb-3"
              >
                <input
                  className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={labelFor("nome_aula")}
                  value={item.nome_aula}
                  onChange={(event) =>
                    updateResumoField(idx, "nome_aula", event.target.value)
                  }
                />
                <input
                  className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={labelFor("descricao_aula")}
                  value={item.descricao_aula}
                  onChange={(event) =>
                    updateResumoField(idx, "descricao_aula", event.target.value)
                  }
                />
                {formState.resumo_aulas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResumo(idx)}
                    className="text-red-500 hover:text-red-600"
                    aria-label={t("course_edit.remove_resumo")}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addResumo}
              className="text-blue-600 font-semibold"
            >
              + {t("course_edit.add_resumo")}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {t("course_edit.mentor_data")}
        </h3>
        {formState.mentor ? (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1 text-gray-800">
                  {labelFor("nome")}
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  value={formState.mentor.nome}
                  onChange={(event) =>
                    updateMentorField("nome", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-800">
                  {labelFor("pais")}
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  value={formState.mentor.pais}
                  onChange={(event) =>
                    updateMentorField("pais", event.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                {labelFor("descricaoMentor")}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formState.mentor.descricao}
                onChange={(event) =>
                  updateMentorField("descricao", event.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1 text-gray-800">
                  {labelFor("instagram")}
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  value={formState.mentor.instagram}
                  onChange={(event) =>
                    updateMentorField("instagram", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-800">
                  {labelFor("instagram_label")}
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  value={formState.mentor.instagram_label}
                  onChange={(event) =>
                    updateMentorField("instagram_label", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1 text-gray-800">
                  {labelFor("linkedin_url")}
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  value={formState.mentor.linkedin_url}
                  onChange={(event) =>
                    updateMentorField("linkedin_url", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-800">
                  {labelFor("linkedin_label")}
                </label>
                <input
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  value={formState.mentor.linkedin_label}
                  onChange={(event) =>
                    updateMentorField("linkedin_label", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">
                {t("course_edit.mentor_photo")}
              </label>
              {formState.mentor.imagemUrl ? (
                <div className="space-y-4">
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <Image
                      src={normalizeStrapiImageUrl(formState.mentor.imagemUrl)}
                      alt="Mentor"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleMentorImageDelete}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors w-fit"
                    aria-label="Remover foto do mentor"
                  >
                    <span className="text-red-600 font-bold text-lg">×</span>
                    <span>{t("course_edit.remove_photo")}</span>
                  </button>
                  {mentorImageUploading && (
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Enviando imagem...
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 flex-shrink-0">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#599fe9] hover:bg-[#599fe9]/90 text-white rounded-lg cursor-pointer transition-colors w-fit">
                      <UploadCloud className="w-5 h-5" />
                      <span>{t("course_edit.upload")}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleMentorImageUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      {t("course_edit.accepted_formats")}
                    </p>
                    {mentorImageUploading && (
                      <span className="flex items-center gap-2 text-xs text-gray-500">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {t("course_edit.uploading")}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {mentorImageError && (
                <p className="text-sm text-red-600 mt-2">{mentorImageError}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">{t("course_edit.no_mentor")}</p>
        )}
      </section>
    </form>
  );
}
