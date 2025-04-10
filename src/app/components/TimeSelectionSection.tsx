"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import EnrollmentModal from "./EnrollmentModal";
import { useTranslations } from "next-intl";

export default function TimeSelectionSection() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("TimeSelection");

  const schedules = [
    {
      day: t("days.monday"),
      time: "11:30",
      startDate: "04/05/25",
      endDate: "04/06/25",
    },
    {
      day: t("days.tuesday"),
      time: "14:00",
      startDate: "05/05/25",
      endDate: "05/06/25",
    },
    {
      day: t("days.wednesday"),
      time: "15:30",
      startDate: "06/05/25",
      endDate: "06/06/25",
    },
    {
      day: t("days.thursday"),
      time: "16:00",
      startDate: "07/05/25",
      endDate: "07/06/25",
    },
  ];

  return (
    <section className="w-full bg-[#1e1b4b] py-16 -mt-[48px]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-white text-2xl mb-2">{t("only")}</h2>
        <div className="text-white text-6xl font-bold mb-4">R$ 35,59</div>
        <p className="text-white text-xl mb-8">
          {t("payment_options", { installment: "35,59", total: "99,99" })}
        </p>

        <p className="text-white text-xl mb-6">
          <span className="font-bold">{t("select")}</span> {t("best_time")}{" "}
          <span className="font-bold">{t("enroll")}</span>
        </p>

        <div className="space-y-4 max-w-md mx-auto mb-8">
          {schedules.map((schedule) => (
            <button
              key={`${schedule.day}-${schedule.time}`}
              onClick={() =>
                setSelectedTime(`${schedule.day}-${schedule.time}`)
              }
              className={`w-full py-4 px-8 rounded-[24px] text-xl font-medium transition-colors duration-300 ${
                selectedTime === `${schedule.day}-${schedule.time}`
                  ? "bg-orange-600 text-white"
                  : "border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
              }`}
            >
              <div className="flex flex-col items-center">
                <div>
                  {schedule.day} {schedule.time}
                </div>
                <div className="text-sm mt-1">
                  {t("start_date")}: {schedule.startDate} {t("end_date")}:{" "}
                  {schedule.endDate}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mb-4 relative">
          <EnrollmentModal
            courseName={t("selected_course")}
            selectedTime={selectedTime}
          />
          <div className="absolute right-0 translate-x-1/2">
            <Image
              src={`/${locale}/garantia-30-dias.png`}
              alt={t("warranty_alt")}
              width={120}
              height={120}
              className="w-32 h-32"
            />
          </div>
        </div>

        <div className="text-white text-sm mt-4">
          {t("terms_agreement")}{" "}
          <Link
            href="/termos"
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
