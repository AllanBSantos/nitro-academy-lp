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
    <section className="w-full bg-white py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-[32px] p-8 shadow-md border-2 border-gray-200 relative">
          <div className="text-center">
            <h2 className="text-gray-800 text-xl mb-2">{t("only")}</h2>
            <div className="text-[#3B82F6] text-5xl font-bold mb-4">
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
              {schedules.map((schedule, index) => (
                <div key={`${schedule.dia}-${schedule.horario}`}>
                  <button
                    onClick={() =>
                      setSelectedTime(`${schedule.dia}-${schedule.horario}`)
                    }
                    className={`w-full py-4 px-6 rounded-xl transition-colors duration-300 ${
                      selectedTime === `${schedule.dia}-${schedule.horario}`
                        ? "border-2 border-orange-500 bg-orange-50"
                        : "border-2 border-gray-300 hover:border-[#3B82F6]"
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-2">
                      {t("class")} {index + 1} - {schedule.faixa_etaria}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[#3B82F6] text-lg font-medium">
                        {schedule.dia} {schedule.horario}
                      </div>
                      <div className="text-sm mt-1 text-gray-500">
                        {t("start_date")}: {formatDate(schedule.data_inicio)}
                        {schedule.data_fim &&
                          ` • ${t("end_date")}: ${formatDate(
                            schedule.data_fim
                          )}`}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <EnrollmentModal
                courseName={course.title || t("selected_course")}
                selectedTime={selectedTime}
                paymentLink={course.link_pagamento}
                cupons={course.cupons}
                courseId={parseInt(course.id)}
              />
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
    </section>
  );
}
