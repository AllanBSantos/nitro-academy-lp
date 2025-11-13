"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Search,
  User,
  BookOpen,
  Clock,
  Calendar,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface Student {
  id: number;
  documentId?: string;
  nome: string;
  cpf_aluno: string;
  cursoAtual: {
    id: number;
    titulo: string;
    slug: string;
  };
}

interface AvailableCourse {
  id: number;
  documentId?: string;
  titulo: string;
  slug: string;
  nivel: string;
  totalAlunos: number;
  alunosMatriculados: number;
  cronograma: Array<{
    dia_semana?: string;
    horario_aula?: string;
  }> | null;
  mentor: {
    nome: string;
  } | null;
}

interface CourseExchangeFormData {
  student: Student | null;
  availableCourses: AvailableCourse[];
  selectedCourseId: number | null;
  selectedCourseDocumentId: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  searching: boolean;
  submitting: boolean;
  showModal: boolean;
  modalType: "success" | "error" | null;
  modalMessage: string;
}

export default function CourseExchangeForm() {
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const router = useRouter();
  const t = useTranslations("CourseExchange");

  const [formData, setFormData] = useState<CourseExchangeFormData>({
    student: null,
    availableCourses: [],
    selectedCourseId: null,
    selectedCourseDocumentId: null,
    loading: false,
    error: null,
    success: false,
    searching: false,
    submitting: false,
    showModal: false,
    modalType: null,
    modalMessage: "",
  });

  const [cpf, setCpf] = useState("");

  const searchStudent = async () => {
    if (!cpf.trim()) {
      setFormData((prev) => ({
        ...prev,
        showModal: true,
        modalType: "error",
        modalMessage: t("please_inform_cpf"),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      searching: true,
      error: null,
      student: null,
      availableCourses: [],
      selectedCourseId: null,
      selectedCourseDocumentId: null,
    }));

    try {
      // Buscar aluno por CPF
      const studentResponse = await fetch(
        `/api/students/${cpf.replace(/\D/g, "")}`
      );

      if (!studentResponse.ok) {
        throw new Error(t("student_not_found"));
      }

      const studentData = await studentResponse.json();

      // Buscar cursos disponíveis
      const coursesResponse = await fetch("/api/courses/available", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!coursesResponse.ok) {
        throw new Error(t("error_fetching_courses"));
      }

      const coursesData = await coursesResponse.json();

      setFormData((prev) => ({
        ...prev,
        student: studentData.student,
        availableCourses: coursesData.courses.filter(
          (course: AvailableCourse) =>
            course.id !== studentData.student.cursoAtual.id
        ),
        searching: false,
        error: null,
        selectedCourseId: null,
        selectedCourseDocumentId: null,
      }));
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        searching: false,
        showModal: true,
        modalType: "error",
        modalMessage:
          error instanceof Error ? error.message : t("error_fetching"),
      }));
    }
  };

  const handleCourseSelection = (course: AvailableCourse) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourseId: course.id,
      selectedCourseDocumentId: course.documentId || null,
    }));
  };

  const submitCourseExchange = async () => {
    if (!formData.selectedCourseId || !formData.student) {
      setFormData((prev) => ({
        ...prev,
        showModal: true,
        modalType: "error",
        modalMessage: t("error_select_course"),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, submitting: true, error: null }));

    try {
      const response = await fetch("/api/courses/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: formData.student.id,
          studentDocumentId: formData.student.documentId,
          newCourseId: formData.selectedCourseId,
          newCourseDocumentId: formData.selectedCourseDocumentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("error_exchange"));
      }

      setFormData((prev) => ({
        ...prev,
        submitting: false,
        showModal: true,
        modalType: "success",
        modalMessage: t("success_message"),
      }));
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        submitting: false,
        showModal: true,
        modalType: "error",
        modalMessage:
          error instanceof Error ? error.message : t("error_exchange"),
      }));
    }
  };

  const openCourseDetails = (slug: string) => {
    window.open(`/${locale}/curso/${slug}`, "_blank");
  };

  const closeModal = () => {
    const wasSuccess = formData.modalType === "success";

    setFormData((prev) => ({
      ...prev,
      showModal: false,
      modalType: null,
      modalMessage: "",
    }));

    if (wasSuccess) {
      // Resetar formulário e redirecionar para a tela principal do locale
      setFormData((prev) => ({
        ...prev,
        student: null,
        availableCourses: [],
        selectedCourseId: null,
        selectedCourseDocumentId: null,
        success: false,
      }));
      setCpf("");
      router.push(`/${locale}`);
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const getDayLabel = (day: string) => {
    const days: { [key: string]: string } = {
      "Segunda-Feira": "Segunda",
      "Terça-Feira": "Terça",
      "Quarta-Feira": "Quarta",
      "Quinta-Feira": "Quinta",
      "Sexta-Feira": "Sexta",
      Sábado: "Sábado",
    };
    return days[day] || day;
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    // Remove o prefixo "BRT" se existir
    return timeString.replace(/^BRT\s*/, "");
  };

  return (
    <div className="space-y-6">
      {/* Busca por CPF */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            {t("search_student")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder={t("cpf_placeholder")}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchStudent()}
              className="flex-1"
            />
            <Button
              onClick={searchStudent}
              disabled={formData.searching}
              className="bg-theme-orange hover:bg-theme-orange/90 text-white"
            >
              {formData.searching ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {t("search")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dados do aluno encontrado */}
      {formData.student && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <User className="w-5 h-5" />
              {t("student_data")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("name")}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.student.nome}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{t("cpf")}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCPF(formData.student.cpf_aluno)}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-600">
                  {t("current_course")}
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  {formData.student.cursoAtual.titulo}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cursos disponíveis */}
      {formData.student && formData.availableCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {t("available_courses_title")}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {t("available_courses_subtitle")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.availableCourses.map((course) => (
                <div
                  key={course.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.selectedCourseId === course.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleCourseSelection(course)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {course.titulo}
                        </h4>
                        <Badge variant="secondary">{course.nivel}</Badge>
                      </div>

                      {course.mentor && course.mentor.nome && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">{t("mentor")}:</span>{" "}
                          {course.mentor.nome}
                        </p>
                      )}

                      {course.cronograma && course.cronograma.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {course.cronograma.map((schedule, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 text-sm text-gray-600"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>
                                {getDayLabel(schedule.dia_semana || "")}
                              </span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{formatTime(schedule.horario_aula)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCourseDetails(course.slug);
                          }}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Info className="w-4 h-4 mr-1" />
                          {t("course_info")}
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>

                    <div className="ml-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.selectedCourseId === course.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.selectedCourseId === course.id && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button
                onClick={submitCourseExchange}
                disabled={
                  formData.submitting ||
                  !formData.selectedCourseId ||
                  !formData.selectedCourseDocumentId
                }
                className="w-full bg-theme-orange hover:bg-theme-orange/90 text-white disabled:bg-gray-300 disabled:text-gray-500"
                size="lg"
              >
                {formData.submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {t("confirm_button")}
              </Button>
              <p className="text-sm text-gray-500 text-center mt-2">
                {formData.selectedCourseId && formData.selectedCourseDocumentId
                  ? t("confirm_helper_selected")
                  : t("confirm_helper_unselected")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não há cursos disponíveis */}
      {formData.student && formData.availableCourses.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("no_courses_title")}
              </h3>
              <p className="text-gray-600">{t("no_courses_desc")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Sucesso/Erro */}
      <Dialog open={formData.showModal} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle
              className={`flex items-center gap-2 ${
                formData.modalType === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formData.modalType === "success" ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
              {formData.modalType === "success"
                ? t("modal_success_title")
                : t("modal_error_title")}
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              {formData.modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={closeModal}
              className="bg-theme-orange hover:bg-theme-orange/90 text-white"
            >
              {t("modal_close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
