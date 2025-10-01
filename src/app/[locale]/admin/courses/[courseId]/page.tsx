"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { fetchCourse, fetchSchools } from "@/lib/strapi";
import {
  ArrowLeft,
  Users,
  Calendar,
  GraduationCap,
  BookOpen,
  ChevronDown,
  Plus,
  Download,
  Phone,
  PhoneOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CourseEditForm from "../../../../components/admin/CourseEditForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { normalizeName, formatPhone } from "@/lib/formatters";

interface StudentDetails {
  nome: string;
  email: string;
  telefone: string;
}

interface RawStudent {
  id: number;
  turma: number;
  documentId: string;
}

interface Student extends RawStudent {
  details?: StudentDetails;
  nome: string;
  escola_parceira?: string;
  createdAt?: string;
  telefone_aluno?: string;
}

interface CronogramaAula {
  data_inicio?: string;
  data_fim?: string;
  faixa_etaria?: string;
  dia_semana?: string;
  horario_aula?: string;
}

interface CourseDetails {
  id: number;
  titulo: string;
  descricao: string;
  descricaoMentor: string;
  nivel: string;
  modelo: string;
  pre_requisitos: string;
  projetos: string;
  tarefa_de_casa: string;
  competencias: string;
  videos: Array<{
    titulo: string;
    video_url: string;
  }>;
  turmas: Array<{
    id: number;
    faixa_etaria: string;
  }>;
  ementa_resumida: Array<{
    descricao: string;
  }>;
  resumo_aulas: Array<{
    nome_aula: string;
    descricao_aula: string;
  }>;
  alunos: Student[];
  cronograma: CronogramaAula[];
  totalSpots: number;
  availableSpots: number;
}

interface School {
  id: string;
  nome: string;
}

type Tab = "alunos" | "aulas" | "pagina";

export default function CourseDashboard() {
  const t = useTranslations("Admin.panel");
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("alunos");
  const [selectedTurma, setSelectedTurma] = useState<number | "all">("all");
  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [showPhone, setShowPhone] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [schools, setSchools] = useState<School[]>([]);
  type SortOption = "name" | "createdAt";
  const [sortOption, setSortOption] = useState<SortOption>("createdAt");
  const [searchQuery, setSearchQuery] = useState("");

  const loadCourseData = useCallback(async () => {
    try {
      const documentId = params.courseId as string;
      const courseData = await fetchCourse(documentId);

      if (!courseData) {
        throw new Error(t("error.course_not_found"));
      }

      const maxStudentsPerClass = parseInt(
        process.env.NEXT_PUBLIC_MAX_STUDENTS_PER_CLASS || "10"
      );
      const totalSpots = Array.isArray(courseData.cronograma)
        ? courseData.cronograma.length * maxStudentsPerClass
        : 0;
      const studentCount = Array.isArray(courseData.alunos)
        ? courseData.alunos.length
        : 0;

      const transformedCourse: CourseDetails = {
        id: courseData.id,
        titulo: courseData.titulo,
        descricao: courseData.descricao,
        descricaoMentor: courseData.mentor?.descricao || "",
        nivel: courseData.nivel,
        modelo: courseData.modelo,
        pre_requisitos: courseData.pre_requisitos,
        projetos: courseData.projetos,
        tarefa_de_casa: courseData.tarefa_de_casa,
        competencias: courseData.competencias || "",
        videos: (courseData.videos || []).map((video) => ({
          titulo: video.titulo || "",
          video_url: video.video_url || "",
        })),
        turmas: Array.isArray(courseData.cronograma)
          ? courseData.cronograma.map(
              (aula: CronogramaAula, index: number) => ({
                id: index + 1,
                faixa_etaria: aula.faixa_etaria || "",
              })
            )
          : [],
        ementa_resumida: courseData.ementa_resumida || [],
        resumo_aulas: courseData.resumo_aulas || [],
        alunos: (courseData.alunos || []).map(
          (aluno: {
            id: number;
            turma: number;
            documentId?: string;
            nome?: string;
            escola_parceira?: string;
            createdAt?: string;
            telefone_aluno?: string;
          }) => ({
            id: aluno.id,
            turma: aluno.turma,
            documentId: aluno.documentId || "",
            nome: aluno.nome || "",
            escola_parceira: aluno.escola_parceira || "",
            createdAt: aluno.createdAt || "",
            telefone_aluno: aluno.telefone_aluno || "",
          })
        ),
        cronograma: Array.isArray(courseData.cronograma)
          ? courseData.cronograma
          : [],
        totalSpots,
        availableSpots: Math.max(0, totalSpots - studentCount),
      };
      setCourse(transformedCourse);
    } catch (err) {
      console.error("Error loading course data:", err);
      if (err instanceof Error) {
        console.error("Error details:", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
      }
      setError(t("error.loading_error"));
    } finally {
      setLoading(false);
    }
  }, [params.courseId, t]);

  const loadSchools = useCallback(async () => {
    try {
      const schoolsData = await fetchSchools();
      setSchools(schoolsData);
    } catch (err) {
      console.error("Error loading schools:", err);
    }
  }, []);

  useEffect(() => {
    loadCourseData();
    loadSchools();
  }, [loadCourseData, loadSchools]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || t("error.course_not_found")}
      </div>
    );
  }

  const availableTurmas = course
    ? Array.from(new Set(course.alunos.map((aluno) => aluno.turma))).sort(
        (a, b) => a - b
      )
    : [];

  const availableSchools = course
    ? Array.from(
        new Set(
          course.alunos.map((aluno) => aluno.escola_parceira).filter(Boolean)
        )
      ).sort()
    : [];

  const filteredAlunos =
    course?.alunos.filter((aluno) => {
      const turmaMatch =
        selectedTurma === "all" || aluno.turma === selectedTurma;
      const schoolMatch =
        selectedSchool === "all" || aluno.escola_parceira === selectedSchool;
      return turmaMatch && schoolMatch;
    }) || [];

  const searchedAlunos = filteredAlunos.filter((aluno) =>
    (aluno.nome || "").toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const sortedAlunos = [...searchedAlunos].sort((a, b) => {
    if (sortOption === "name") {
      return (a.nome || "").localeCompare(b.nome || "", undefined, {
        sensitivity: "base",
      });
    }
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime; // oldest first (order of arrival)
  });

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("pt-BR") : "-";

  const exportToPDF = () => {
    if (!course) return;

    const doc = new jsPDF();

    // Título do curso
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Lista de Alunos", 20, 20);

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(`Curso: ${course.titulo}`, 20, 35);

    doc.setFontSize(12);
    doc.text(`Total de alunos: ${sortedAlunos.length}`, 20, 45);
    doc.text(
      `Data de exportação: ${new Date().toLocaleDateString("pt-BR")}`,
      20,
      55
    );

    // Preparar dados para a tabela
    const tableData = sortedAlunos.map((aluno) => [
      normalizeName(aluno.nome || "-"),
      `Turma ${aluno.turma}`,
      aluno.escola_parceira || "-",
      formatDate(aluno.createdAt),
      showPhone
        ? aluno.telefone_aluno
          ? formatPhone(aluno.telefone_aluno)
          : "-"
        : "-",
    ]);

    // Cabeçalhos da tabela
    const headers = [
      "Nome",
      "Turma",
      "Escola Parceira",
      "Data de Inscrição",
      showPhone ? "Telefone" : "",
    ].filter(Boolean);

    // Adicionar tabela
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 70,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // Salvar PDF
    doc.save(
      `alunos-${course.titulo.replace(/[^a-zA-Z0-9]/g, "-")}-${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "alunos":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("students.title")}
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Filtro por turma */}
                  <div className="relative w-full sm:w-48">
                    <select
                      value={selectedTurma}
                      onChange={(e) =>
                        setSelectedTurma(
                          e.target.value === "all"
                            ? "all"
                            : Number(e.target.value)
                        )
                      }
                      className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm cursor-pointer"
                      style={{ color: "rgb(17, 24, 39)" }}
                    >
                      <option value="all" className="text-gray-900">
                        {t("students.all_classes")}
                      </option>
                      {availableTurmas.map((turma) => (
                        <option
                          key={turma}
                          value={turma}
                          className="text-gray-900"
                        >
                          {t("students.class", { number: turma })}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Filtro por escola */}
                  <div className="relative w-full sm:w-48">
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm cursor-pointer"
                      style={{ color: "rgb(17, 24, 39)" }}
                    >
                      <option value="all" className="text-gray-900">
                        Todas as escolas
                      </option>
                      {availableSchools.map((school) => (
                        <option
                          key={school}
                          value={school}
                          className="text-gray-900"
                        >
                          {school}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Campo de busca */}
                  <div className="w-full sm:w-64">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("students.search_placeholder")}
                      className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* Ordenação */}
                  <div className="relative w-full sm:w-56">
                    <select
                      value={sortOption}
                      onChange={(e) =>
                        setSortOption(e.target.value as SortOption)
                      }
                      className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm cursor-pointer"
                      style={{ color: "rgb(17, 24, 39)" }}
                    >
                      <option value="createdAt" className="text-gray-900">
                        {t("students.sort.createdAt")}
                      </option>
                      <option value="name" className="text-gray-900">
                        {t("students.sort.name")}
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Contador de alunos */}
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium whitespace-nowrap">
                    {t("students.student_count", {
                      count: sortedAlunos.length,
                    })}
                  </span>
                </div>
              </div>

              {/* Controles adicionais */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  {/* Checkbox para mostrar telefone */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPhone}
                      onChange={(e) => setShowPhone(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      {showPhone ? (
                        <Phone className="w-4 h-4" />
                      ) : (
                        <PhoneOff className="w-4 h-4" />
                      )}
                      {showPhone ? "Ocultar telefone" : "Mostrar telefone"}
                    </span>
                  </label>
                </div>

                {/* Botão de exportar PDF */}
                <button
                  onClick={exportToPDF}
                  disabled={sortedAlunos.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("students.table.name")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("students.table.class")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("students.table.school")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("students.table.created_at")}
                    </th>
                    {showPhone && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedAlunos.map((student) => {
                    const studentName = normalizeName(
                      student.nome || t("loading")
                    );
                    const studentInitial = studentName.charAt(0).toUpperCase();

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {studentInitial}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {studentName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {t("students.class", { number: student.turma })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {student.escola_parceira || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(student.createdAt)}
                          </div>
                        </td>
                        {showPhone && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {student.telefone_aluno
                                ? formatPhone(student.telefone_aluno)
                                : "-"}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "aulas":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("classes.title")}
                </h2>
                <button
                  onClick={() => {
                    alert(t("classes.feature_development"));
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {t("classes.register_new")}
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t("classes.no_classes")}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t("classes.start_registering")}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      alert(t("classes.feature_development"));
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {t("classes.register_new")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "pagina":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-8">
            <CourseEditForm course={course} onUpdateSuccess={loadCourseData} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("back")}
          </button>
          <h1 className="text-4xl font-bold mb-4">{course.titulo}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {t("stats.total_spots")}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {course.totalSpots}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {t("stats.enrolled_students")}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {course.alunos.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {t("stats.available_spots")}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {course.availableSpots}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("alunos")}
              className={`$${
                activeTab === "alunos"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {t("tabs.students")}
            </button>
            <button
              onClick={() => setActiveTab("aulas")}
              className={`$${
                activeTab === "aulas"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {t("tabs.classes")}
            </button>
            <button
              onClick={() => setActiveTab("pagina")}
              className={`$${
                activeTab === "pagina"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Detalhes do curso
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
