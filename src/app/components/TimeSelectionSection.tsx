"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import EnrollmentModal from "./EnrollmentModal";
import { useTranslations } from "next-intl";
import { CardProps } from "@/types/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Schedule {
  dia: string;
  horario: string;
  faixa_etaria: string;
  data_inicio: string;
  data_fim?: string;
}

interface TimeSelectionSectionProps {
  course: CardProps;
  isCourseFull: boolean;
  currentStudents: number;
  maxStudents: number;
  onScheduleClick: (classNumber: string) => void;
  isScheduleFull: (classNumber: string) => boolean;
}

export default function TimeSelectionSection({
  course,
  isCourseFull,
  onScheduleClick,
  isScheduleFull,
}: TimeSelectionSectionProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [suggestionData, setSuggestionData] = useState({
    weekdays: [] as string[],
    time: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("TimeSelection");

  const WEEKDAYS = [
    t("days.sunday"),
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
  ];

  useEffect(() => {
    if (
      isInitialRender &&
      !isCourseFull &&
      course.cronograma &&
      course.cronograma.length > 0
    ) {
      // Find the first schedule that is not full
      const firstValidSchedule = course.cronograma.find(
        (_, index) => !isScheduleFull((index + 1).toString())
      );
      if (firstValidSchedule) {
        const scheduleIndex = course.cronograma.indexOf(firstValidSchedule);
        setSelectedTime(
          `${firstValidSchedule.dia}-${firstValidSchedule.horario}`
        );
        onScheduleClick((scheduleIndex + 1).toString());
      } else {
        // Only set to suggestion if no valid schedules are found
        setSelectedTime("suggestion");
      }
      setIsInitialRender(false);
    }
  }, [
    isCourseFull,
    course.cronograma,
    isScheduleFull,
    onScheduleClick,
    isInitialRender,
  ]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const handleWeekdayChange = (weekday: string) => {
    setSuggestionData((prev) => ({
      ...prev,
      weekdays: prev.weekdays.includes(weekday)
        ? prev.weekdays.filter((day) => day !== weekday)
        : [...prev.weekdays, weekday],
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 5) {
      setSuggestionData((prev) => ({ ...prev, time: value }));
    }
  };

  const handleSubmitSuggestion = async () => {
    if (!suggestionData.weekdays.length || !suggestionData.time) return;

    setIsSubmitting(true);
    try {
      const emailBody = `
        Nova sugestão de horário para o curso: ${course.title}
        
        Dias sugeridos: ${suggestionData.weekdays.join(", ")}
        Horário sugerido: ${suggestionData.time}
        Comentário: ${suggestionData.comment || "Sem comentários"}
      `;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: process.env.NEXT_PUBLIC_ENROLLMENT_EMAIL,
          subject: `Sugestão de novo horário - ${course.title}`,
          text: emailBody,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send suggestion");
      }

      setIsSuggestionModalOpen(false);
      setSuggestionData({
        weekdays: [],
        time: "",
        comment: "",
      });
    } catch (error) {
      console.error("Error sending suggestion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeSelect = (schedule: Schedule, index: number) => {
    const classNumber = (index + 1).toString();
    if (!isScheduleFull(classNumber)) {
      setSelectedTime(`${schedule.dia}-${schedule.horario}`);
      onScheduleClick(classNumber);
    }
  };

  const schedules = course.cronograma || [];

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-[32px] p-8 shadow-md border-2 border-gray-200 relative">
          <div className="text-center">
            <h2 className="text-gray-800 text-xl mb-2">{t("only")}</h2>
            <div className="text-[#3B82F6] text-4xl font-bold mb-4">
              {course.moeda === "Real" ? "R$" : "USD"}{" "}
              {course.price.installments
                ? course.price.installment.toFixed(2).replace(".", ",")
                : course.price.total.toFixed(2).replace(".", ",")}
            </div>
            {course.price.installments ? (
              <p className="text-gray-600 text-md mb-8">
                {t("payment_options", {
                  installment: `${
                    course.moeda === "Real" ? "R$" : "USD"
                  } ${course.price.installment.toFixed(2).replace(".", ",")}`,
                  total: `${
                    course.moeda === "Real" ? "R$" : "USD"
                  } ${course.price.total.toFixed(2).replace(".", ",")}`,
                  installments: course.price.installments,
                })}
              </p>
            ) : null}

            <p className="text-gray-800 text-lg mb-6">
              {t("select")} {t("best_time")} {t("enroll")}
            </p>

            <div className="space-y-4 max-w-md mx-auto mb-8">
              {schedules.map((schedule, index) => {
                const classNumber = (index + 1).toString();
                const isFull = isScheduleFull(classNumber);
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
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              {selectedTime === "suggestion" ? (
                <Button
                  onClick={() => setIsSuggestionModalOpen(true)}
                  className="bg-orange-600 text-[#1e1b4b] text-xl font-bold py-4 px-8 rounded-[24px] hover:bg-orange-500 transition-colors duration-300 w-full max-w-md"
                >
                  {t("suggest_new_time")}
                </Button>
              ) : (
                <EnrollmentModal
                  courseName={course.title || t("selected_course")}
                  selectedTime={selectedTime}
                  paymentLink={course.link_pagamento}
                  link_desconto={course.link_desconto}
                  cupons={course.cupons}
                  courseId={parseInt(course.id)}
                  scheduleIndex={schedules.findIndex(
                    (s) => `${s.dia}-${s.horario}` === selectedTime
                  )}
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
      </div>

      <Dialog
        open={isSuggestionModalOpen}
        onOpenChange={setIsSuggestionModalOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-white text-[#1e1b4b] border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6 text-[#1e1b4b]">
              {t("suggest_new_time")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {t("suggestion.weekdays")}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {WEEKDAYS.map((weekday) => (
                  <div key={weekday} className="flex items-center space-x-3">
                    <Checkbox
                      id={weekday}
                      checked={suggestionData.weekdays.includes(weekday)}
                      onCheckedChange={() => handleWeekdayChange(weekday)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={weekday} className="text-base">
                      {weekday}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">{t("suggestion.time")}</Label>
              <Input
                id="time"
                type="time"
                value={suggestionData.time}
                onChange={handleTimeChange}
                className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">{t("suggestion.comment")}</Label>
              <Input
                id="comment"
                value={suggestionData.comment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSuggestionData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
              />
            </div>

            <Button
              onClick={handleSubmitSuggestion}
              disabled={
                !suggestionData.weekdays.length ||
                !suggestionData.time ||
                isSubmitting
              }
              className="w-full bg-orange-600 text-white hover:bg-orange-500 py-6 text-lg font-semibold"
            >
              {isSubmitting ? t("suggestion.sending") : t("suggestion.submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
