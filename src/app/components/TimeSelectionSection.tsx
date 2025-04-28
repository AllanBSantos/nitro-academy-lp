"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import EnrollmentModal from "./EnrollmentModal";
import { useTranslations } from "next-intl";
import { CardProps } from "./Card";

interface TimeSelectionSectionProps {
  course: CardProps;
}

export default function TimeSelectionSection({
  course,
}: TimeSelectionSectionProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(
    course.cronograma && course.cronograma.length > 0
      ? `${course.cronograma[0].dia}-${course.cronograma[0].horario}`
      : null
  );
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("TimeSelection");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const schedules = course.cronograma || [];

  return (
    <section className="w-full bg-[#1e1b4b] py-16 -mt-[48px]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-white text-2xl mb-2">{t("only")}</h2>
        <div className="text-white text-5xl font-bold mb-4">
          {course.moeda === "Real" ? "R$" : "USD"}{" "}
          {course.price.installments
            ? course.price.installment.toFixed(2).replace(".", ",")
            : course.price.total.toFixed(2).replace(".", ",")}
        </div>
        {course.price.installments ? (
          <p className="text-white text-md mb-8">
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

        <p className="text-white text-xl mb-6">
          <span className="font-bold">{t("select")}</span> {t("best_time")}{" "}
          <span className="font-bold">{t("enroll")}</span>
        </p>

        <div className="space-y-4 max-w-md mx-auto mb-8">
          {schedules.map((schedule, index) => (
            <div key={`${schedule.dia}-${schedule.horario}`}>
              <button
                onClick={() =>
                  setSelectedTime(`${schedule.dia}-${schedule.horario}`)
                }
                className={`w-full py-4 px-8 rounded-[24px] text-xl font-medium transition-colors duration-300 ${
                  selectedTime === `${schedule.dia}-${schedule.horario}`
                    ? "bg-orange-600 text-white"
                    : "border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                }`}
              >
                <div className="text-sm mt-1 text-white mb-2 font-bold">
                  {t("class")} {index + 1} - {schedule.faixa_etaria}
                </div>
                <div className="flex flex-col items-center">
                  <div>
                    {schedule.dia} {schedule.horario}
                  </div>
                  <div className="text-sm mt-1">
                    {t("start_date")}: {formatDate(schedule.data_inicio)}
                    {schedule.data_fim &&
                      ` ${t("end_date")}: ${formatDate(schedule.data_fim)}`}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 relative">
          <EnrollmentModal
            courseName={course.title || t("selected_course")}
            selectedTime={selectedTime}
            paymentLink={course.link_pagamento}
            cupons={course.cupons}
            courseId={parseInt(course.id)}
          />
          <div className="sm:absolute sm:right-0 sm:translate-x-1/2 mt-4 sm:mt-0">
            <Image
              src={`/${locale}/garantia-30-dias.png`}
              alt={t("warranty_alt")}
              width={120}
              height={120}
              className="w-24 h-24 sm:w-32 sm:h-32"
            />
          </div>
        </div>

        <div className="text-white text-sm mt-4">
          {t("terms_agreement")}{" "}
          <Link
            href={`/${locale}/termos`}
            target="_blank"
            className="text-[#3B82F6] hover:underline"
          >
            {t("terms_link")}
          </Link>
        </div>
      </div>
    </section>
  );
}
