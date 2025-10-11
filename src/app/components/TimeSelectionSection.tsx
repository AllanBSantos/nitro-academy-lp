"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EnrollmentModal from "./EnrollmentModal";
import SuggestionModal from "./SuggestionModal";
import { useTranslations } from "next-intl";
import { CardProps, Turma } from "@/types/card";

interface Schedule {
  dia: string;
  horario: string;
  dia_semana?: string;
  horario_aula?: string;
  data_inicio?: string;
  data_fim?: string;
  faixa_etaria?: string;
}

interface TimeSelectionSectionProps {
  inscricoes_abertas: boolean;
  course: CardProps;
  onScheduleClick: (classNumber: string) => void;
  isScheduleFull: (classNumber: string) => boolean;
}

export default function TimeSelectionSection({
  inscricoes_abertas,
  course,
  onScheduleClick,
  isScheduleFull,
}: TimeSelectionSectionProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("TimeSelection");
  const tDay = useTranslations("CourseFilters");

  const DAY_LABELS: Record<string, string> = {
    "Segunda-Feira": tDay("monday"),
    "Terça-Feira": tDay("tuesday"),
    "Quarta-Feira": tDay("wednesday"),
    "Quinta-Feira": tDay("thursday"),
    "Sexta-Feira": tDay("friday"),
  };

  const handleTimeSelect = (schedule: Schedule, index: number) => {
    const classNumber = (index + 1).toString();
    // Bloqueia seleção se turma cheia
    if (isScheduleFull(classNumber)) {
      return;
    }
    setSelectedTime(`${schedule.dia_semana}-${schedule.horario_aula}`);
    setSelectedClass(classNumber);
    onScheduleClick(classNumber);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const schedules = useMemo(() => course.cronograma || [], [course.cronograma]);

  // Seleção automática quando há apenas uma opção de cronograma
  useEffect(() => {
    if (schedules.length === 1 && inscricoes_abertas && !selectedTime) {
      const schedule = schedules[0];
      const classNumber = "1";

      // Verificar se o schedule tem as propriedades necessárias
      if (schedule.dia_semana && schedule.horario_aula) {
        const isOnlyClassFull = isScheduleFull(classNumber);
        if (isOnlyClassFull) {
          return;
        }

        setSelectedTime(`${schedule.dia_semana}-${schedule.horario_aula}`);
        setSelectedClass(classNumber);
        onScheduleClick(classNumber);
      }
    }
  }, [
    schedules,
    inscricoes_abertas,
    selectedTime,
    isScheduleFull,
    onScheduleClick,
  ]);

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[32px] p-8 shadow-md border-2 border-gray-200 relative">
          <div className="text-center">
            {inscricoes_abertas && (
              <p className="text-gray-800 text-lg mb-6">
                {t("select")} {t("best_time")} {t("enroll")}
              </p>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm text-center">
                {t("seats_warning")}
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto mb-8">
              {schedules.map((schedule, index) => {
                const classNumber = (index + 1).toString();
                const isSelected =
                  selectedTime ===
                  `${schedule.dia_semana}-${schedule.horario_aula}`;

                const classIsFull = isScheduleFull(classNumber);

                return (
                  <div key={index} className="mb-4">
                    <button
                      onClick={() => handleTimeSelect(schedule, index)}
                      disabled={!inscricoes_abertas || classIsFull}
                      className={`w-full py-4 px-6 rounded-xl border-2 transition-colors ${
                        !inscricoes_abertas
                          ? "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-70"
                          : classIsFull
                          ? "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-70"
                          : isSelected
                          ? "border-2 border-orange-500 bg-orange-50"
                          : "border-2 border-gray-300 hover:border-[#3B82F6]"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-600 mb-2">
                          {t("class")} {classNumber} - De 12 a 17 anos
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-[#3B82F6] text-lg font-medium">
                            {DAY_LABELS[(schedule.dia_semana || "").trim()] ||
                              schedule.dia_semana}{" "}
                            {schedule.horario_aula}
                          </div>
                          {classIsFull && (
                            <div className="text-sm mt-1 text-red-600 font-medium">
                              {t("class_full")}
                            </div>
                          )}
                          <div className="text-sm mt-1 text-gray-500">
                            {t("start_date")}:{" "}
                            {schedule.data_inicio
                              ? formatDate(schedule.data_inicio)
                              : ""}
                            {schedule.data_fim &&
                              ` • ${t("end_date")}: ${formatDate(
                                schedule.data_fim
                              )}`}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}

              {course.sugestao_horario !== false && (
                <button
                  onClick={() => {
                    setSelectedTime("suggestion");
                  }}
                  className={`w-full py-4 px-6 rounded-xl border-2 transition-colors ${
                    selectedTime === "suggestion"
                      ? "border-2 border-orange-500 bg-orange-50"
                      : "border-2 border-gray-300 hover:border-[#3B82F6]"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-[#3B82F6] text-lg font-medium">
                      {t("suggest_new_time")}
                    </div>
                  </div>
                </button>
              )}

              {!inscricoes_abertas && (
                <p className="text-red-500 text-lg mb-6 text-center">
                  {t("inscricoes_fechadas")}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              {selectedTime === "suggestion" ? (
                <button
                  onClick={() => setIsSuggestionModalOpen(true)}
                  className="bg-orange-600 text-[#1e1b4b] text-xl font-bold py-4 px-8 rounded-[24px] hover:bg-orange-500 transition-colors duration-300 w-full max-w-md"
                >
                  {t("suggest_new_time")}
                </button>
              ) : (
                <EnrollmentModal
                  courseName={course.title || t("selected_course")}
                  selectedTime={selectedTime || ""}
                  courseId={parseInt(course.id)}
                  scheduleIndex={
                    selectedClass ? parseInt(selectedClass) - 1 : 0
                  }
                  disabled={
                    !selectedTime ||
                    !selectedClass ||
                    !inscricoes_abertas ||
                    (selectedClass ? isScheduleFull(selectedClass) : false)
                  }
                  aviso_matricula={course.aviso_matricula}
                  pre_requisitos={course.pre_requisitos}
                />
              )}
            </div>

            <div className="text-gray-500 text-sm mt-4">
              <p>{t("terms_agreement")}</p>
              <p>
                <Link
                  href={`/${locale}/termos`}
                  target="_blank"
                  className="text-[#3B82F6] hover:underline"
                >
                  {t("terms_link")}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {course.turmas?.map((turma: Turma) => (
          <div key={turma.id} className="mb-8">
            <div className="space-y-4 max-w-md mx-auto mb-8">
              {schedules.map((schedule, index) => {
                const classNumber = (index + 1).toString();

                const isSelected =
                  selectedTime ===
                  `${schedule.dia_semana}-${schedule.horario_aula}`;

                return (
                  <div key={index} className="mb-4">
                    <button
                      onClick={() => handleTimeSelect(schedule, index)}
                      className={`w-full py-4 px-6 rounded-xl border-2 transition-colors ${
                        isSelected
                          ? "border-2 border-orange-500 bg-orange-50"
                          : "border-2 border-gray-300 hover:border-[#3B82F6]"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-600 mb-2">
                          {t("class")} {classNumber} - De 12 a 17 anos
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-[#3B82F6] text-lg font-medium">
                            {DAY_LABELS[(schedule.dia_semana || "").trim()] ||
                              schedule.dia_semana}{" "}
                            {schedule.horario_aula}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {selectedTime === "suggestion" && (
          <SuggestionModal
            isOpen={isSuggestionModalOpen}
            onOpenChange={setIsSuggestionModalOpen}
            courseName={course.title}
            courseId={parseInt(course.id)}
          />
        )}
      </div>
    </section>
  );
}
