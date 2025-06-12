"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import EnrollmentModal from "./EnrollmentModal";
import SuggestionModal from "./SuggestionModal";
import { useTranslations } from "next-intl";
import { CardProps, Turma } from "@/types/card";
import { Button } from "@/components/ui/button";

interface Schedule {
  dia: string;
  horario: string;
  faixa_etaria: string;
  data_inicio: string;
  data_fim?: string;
}

interface TimeSelectionSectionProps {
  course: CardProps;
  getClassAvailability: (classNumber: string) => {
    isFull: boolean;
    currentStudents: number;
    maxStudents: number;
  };
  onScheduleClick: (classNumber: string) => void;
  isScheduleFull: (classNumber: string) => boolean;
}

export default function TimeSelectionSection({
  course,
  getClassAvailability,
  onScheduleClick,
  isScheduleFull,
}: TimeSelectionSectionProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("TimeSelection");
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);

  const handleTimeSelect = (schedule: Schedule, index: number) => {
    const classNumber = (index + 1).toString();
    if (!isScheduleFull(classNumber)) {
      setSelectedTime(`${schedule.dia}-${schedule.horario}`);
      setSelectedClass(classNumber);
      onScheduleClick(classNumber);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const schedules = course.cronograma || [];

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[32px] p-8 shadow-md border-2 border-gray-200 relative">
          <div className="text-center">
            <h2 className="text-gray-800 text-xl mb-2">{t("only")}</h2>
            <div className="text-[#3B82F6] text-4xl font-bold mb-4">
              {course.moeda === "Real" ? "R$" : "USD"}{" "}
              {course.price?.installments
                ? course.price?.installment.toFixed(2).replace(".", ",")
                : course.price?.total.toFixed(2).replace(".", ",")}
            </div>
            {course.price?.installments ? (
              <p className="text-gray-600 text-md mb-8">
                {t("payment_options", {
                  installment: `${
                    course.moeda === "Real" ? "R$" : "USD"
                  } ${course.price?.installment.toFixed(2).replace(".", ",")}`,
                  total: `${
                    course.moeda === "Real" ? "R$" : "USD"
                  } ${course.price?.total.toFixed(2).replace(".", ",")}`,
                  installments: course.price?.installments,
                })}
              </p>
            ) : null}

            <p className="text-gray-800 text-lg mb-6">
              {t("select")} {t("best_time")} {t("enroll")}
            </p>

            <div className="space-y-4 max-w-md mx-auto mb-8">
              {schedules.map((schedule, index) => {
                const classNumber = (index + 1).toString();
                const { isFull } = getClassAvailability(classNumber);
                const isSelected =
                  selectedTime === `${schedule.dia}-${schedule.horario}`;

                return (
                  <div key={`${schedule.dia}-${schedule.horario}`}>
                    <button
                      type="button"
                      onClick={() => handleTimeSelect(schedule, index)}
                      disabled={isFull}
                      className={`w-full py-4 px-6 rounded-xl transition-colors duration-300 ${
                        isFull
                          ? "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-70"
                          : isSelected
                          ? "border-2 border-orange-500 bg-orange-50"
                          : "border-2 border-gray-300 hover:border-[#3B82F6]"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {isFull && (
                          <span className="text-sm text-red-500 font-medium mb-2">
                            {t("class_full")}
                          </span>
                        )}
                        <div className="text-sm text-gray-600 mb-2">
                          {t("class")} {classNumber} - {schedule.faixa_etaria}
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-[#3B82F6] text-lg font-medium">
                            {schedule.dia} {schedule.horario}
                          </div>
                          <div className="text-sm mt-1 text-gray-500">
                            {t("start_date")}:{" "}
                            {formatDate(schedule.data_inicio)}
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
                  paymentLink={course.link_pagamento}
                  link_desconto={course.link_desconto}
                  cupons={course.cupons}
                  courseId={parseInt(course.id)}
                  scheduleIndex={
                    selectedClass ? parseInt(selectedClass) - 1 : 0
                  }
                  disabled={!selectedTime || !selectedClass}
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

          <div className="absolute -bottom-12 -right-16 hidden sm:block">
            <Image
              src={`/${locale}/garantia-30-dias.png`}
              alt={t("warranty_alt")}
              width={120}
              height={120}
              className="w-32 h-32"
            />
          </div>
        </div>

        {course.turmas?.map((turma: Turma) => (
          <div key={turma.id} className="mb-8">
            {turma.vagas_disponiveis === 0 ? (
              <div className="mt-4">
                <p className="text-red-600 font-semibold mb-4">
                  {t("class_full")}
                </p>
                {course.sugestao_horario !== false && (
                  <Button
                    onClick={() => {
                      setSelectedTurma(turma);
                      setIsSuggestionModalOpen(true);
                    }}
                    className="bg-orange-600 text-white hover:bg-orange-500 py-6 text-lg font-semibold w-full"
                  >
                    {t("suggest_new_time")}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto mb-8">
                {schedules.map((schedule, index) => {
                  const classNumber = (index + 1).toString();
                  const { isFull, currentStudents, maxStudents } =
                    getClassAvailability(classNumber);
                  const isSelected =
                    selectedTime === `${schedule.dia}-${schedule.horario}`;

                  return (
                    <div key={`${schedule.dia}-${schedule.horario}`}>
                      <button
                        type="button"
                        onClick={() => handleTimeSelect(schedule, index)}
                        disabled={isFull}
                        className={`w-full py-4 px-6 rounded-xl transition-colors duration-300 ${
                          isFull
                            ? "border-2 border-gray-300 bg-gray-100 cursor-not-allowed opacity-70"
                            : isSelected
                            ? "border-2 border-orange-500 bg-orange-50"
                            : "border-2 border-gray-300 hover:border-[#3B82F6]"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          {isFull && (
                            <span className="text-sm text-red-500 font-medium mb-2">
                              {t("class_full")}
                            </span>
                          )}
                          <div className="text-sm text-gray-600 mb-2">
                            {t("class")} {classNumber} - {schedule.faixa_etaria}
                            {!isFull && (
                              <span className="ml-2 text-gray-500">
                                ({currentStudents}/{maxStudents} {t("students")}
                                )
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-[#3B82F6] text-lg font-medium">
                              {schedule.dia} {schedule.horario}
                            </div>
                            <div className="text-sm mt-1 text-gray-500">
                              {t("start_date")}:{" "}
                              {formatDate(schedule.data_inicio)}
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
              </div>
            )}
          </div>
        ))}

        {selectedTurma && (
          <SuggestionModal
            isOpen={isSuggestionModalOpen}
            onOpenChange={setIsSuggestionModalOpen}
            courseName={course.title}
            courseId={parseInt(course.id)}
          />
        )}

        {!selectedTurma && selectedTime === "suggestion" && (
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
