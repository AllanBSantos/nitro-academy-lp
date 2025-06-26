import { useState } from "react";
import { updateCourse } from "@/lib/strapi";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface Video {
  titulo: string;
  video_url: string;
}

interface CourseVideo {
  titulo: string | null;
  video_url: string;
}

interface Turma {
  id: number;
  faixa_etaria: string;
}

interface EmentaResumida {
  descricao: string;
}

interface ResumoAula {
  nome_aula: string;
  descricao_aula: string;
}

interface CronogramaAula {
  titulo: string;
  descricao: string;
  faixa_etaria?: string;
}

interface CourseEditFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  course: any;
  onUpdateSuccess?: () => void;
}

export default function CourseEditForm({
  course,
  onUpdateSuccess,
}: CourseEditFormProps) {
  const t = useTranslations("Admin.panel");
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [titulo, setTitulo] = useState(course.titulo || course.title || "");
  const [descricao, setDescricao] = useState(
    course.descricao || course.description || ""
  );
  const [descricaoMentor, setDescricaoMentor] = useState(
    course.descricaoMentor || ""
  );
  const [nivel, setNivel] = useState(course.nivel || "");
  const [modelo, setModelo] = useState(course.modelo || "");
  const [objetivo, setObjetivo] = useState(course.objetivo || "");
  const [preRequisitos, setPreRequisitos] = useState(
    course.pre_requisitos || ""
  );
  const [tarefaDeCasa, setTarefaDeCasa] = useState(course.tarefa_de_casa || "");
  const [competencias, setCompetencias] = useState(course.competencias || "");
  const [projetos, setProjetos] = useState(course.projetos || "");
  const [destaques, setDestaques] = useState(course.destaques || "");
  const [idealPara, setIdealPara] = useState(course.ideal_para || "");

  const [videos, setVideos] = useState<Video[]>(
    (course.videos || []).map((video: CourseVideo) => ({
      titulo: video.titulo ?? "",
      video_url: video.video_url || "",
    }))
  );
  const [turmas, setTurmas] = useState<Turma[]>(course.turmas || []);
  const [ementaResumida, setEmentaResumida] = useState<EmentaResumida[]>(
    course.ementa_resumida || []
  );
  const [resumoAulas, setResumoAulas] = useState<ResumoAula[]>(
    course.resumo_aulas || []
  );

  const handleVideoChange = (
    idx: number,
    field: keyof Video,
    value: string
  ) => {
    setVideos((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v))
    );
  };
  const addVideo = () =>
    setVideos((prev) => [...prev, { titulo: "", video_url: "" }]);
  const removeVideo = (idx: number) =>
    setVideos((prev) => prev.filter((_, i) => i !== idx));

  const handleTurmaChange = (idx: number, value: string) => {
    setTurmas((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, faixa_etaria: value } : t))
    );
  };

  const handleEmentaChange = (idx: number, value: string) => {
    setEmentaResumida((prev) =>
      prev.map((e, i) => (i === idx ? { descricao: value } : e))
    );
  };
  const addEmenta = () =>
    setEmentaResumida((prev) => [...prev, { descricao: "" }]);
  const removeEmenta = (idx: number) =>
    setEmentaResumida((prev) => prev.filter((_, i) => i !== idx));

  const handleResumoAulaChange = (
    idx: number,
    field: keyof ResumoAula,
    value: string
  ) => {
    setResumoAulas((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  };
  const addResumoAula = () =>
    setResumoAulas((prev) => [...prev, { nome_aula: "", descricao_aula: "" }]);
  const removeResumoAula = (idx: number) =>
    setResumoAulas((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const documentId = params.courseId as string;

      // Transform cronograma data to include faixa_etaria from turmas
      const cronograma = course.cronograma?.map(
        (aula: CronogramaAula, index: number) => ({
          ...aula,
          faixa_etaria: turmas[index]?.faixa_etaria || "",
        })
      );

      // Map frontend camelCase to backend snake_case
      const updateData = {
        titulo,
        descricao,
        nivel,
        modelo,
        objetivo,
        pre_requisitos: preRequisitos,
        projetos,
        tarefa_de_casa: tarefaDeCasa,
        destaques,
        competencias,
        ideal_para: idealPara,
        videos,
        cronograma,
        ementa_resumida: ementaResumida,
        resumo_aulas: resumoAulas,
      };

      await updateCourse(documentId, updateData);

      setSubmitSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erro ao atualizar o curso"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {t("course_edit.success")}
        </div>
      )}

      <div>
        <label className="block font-semibold mb-1 text-gray-800">Título</label>
        <input
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Descrição
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Descrição do Mentor
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          value={descricaoMentor}
          onChange={(e) => setDescricaoMentor(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">Vídeos</label>
        {videos.map((video, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Título"
              value={video.titulo}
              onChange={(e) => handleVideoChange(idx, "titulo", e.target.value)}
            />
            <input
              className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Link do YouTube"
              value={video.video_url}
              onChange={(e) =>
                handleVideoChange(idx, "video_url", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeVideo(idx)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVideo}
          className="text-blue-600 font-semibold"
        >
          + Adicionar vídeo
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Nível
          </label>
          <input
            className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-800">
            Modelo
          </label>
          <input
            className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Objetivo
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Pré-requisitos
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          value={preRequisitos}
          onChange={(e) => setPreRequisitos(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Tarefa de casa
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          value={tarefaDeCasa}
          onChange={(e) => setTarefaDeCasa(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Competências
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          value={competencias}
          onChange={(e) => setCompetencias(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Projetos
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          value={projetos}
          onChange={(e) => setProjetos(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Destaques
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          value={destaques}
          onChange={(e) => setDestaques(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Ideal para
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          value={idealPara}
          onChange={(e) => setIdealPara(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Turmas (faixa etária)
        </label>
        {turmas.map((turma, idx) => (
          <div key={turma.id} className="flex gap-2 mb-2 items-center">
            <span className="w-24 font-medium text-gray-700">
              Turma {turma.id}
            </span>
            <input
              className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Faixa etária"
              value={turma.faixa_etaria}
              onChange={(e) => handleTurmaChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Ementa Resumida
        </label>
        {ementaResumida.map((e, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Descrição"
              value={e.descricao}
              onChange={(ev) => handleEmentaChange(idx, ev.target.value)}
            />
            <button
              type="button"
              onClick={() => removeEmenta(idx)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEmenta}
          className="text-blue-600 font-semibold"
        >
          + Adicionar ementa
        </button>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-800">
          Resumo das Aulas
        </label>
        {resumoAulas.map((a, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nome da aula"
              value={a.nome_aula}
              onChange={(e) =>
                handleResumoAulaChange(idx, "nome_aula", e.target.value)
              }
            />
            <input
              className="flex-1 border border-gray-300 rounded p-2 text-gray-900 bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Descrição da aula"
              value={a.descricao_aula}
              onChange={(e) =>
                handleResumoAulaChange(idx, "descricao_aula", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeResumoAula(idx)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addResumoAula}
          className="text-blue-600 font-semibold"
        >
          + Adicionar aula
        </button>
      </div>
      <div className="pt-4">
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
    </form>
  );
}
