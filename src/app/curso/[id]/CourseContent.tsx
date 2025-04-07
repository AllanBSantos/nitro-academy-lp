"use client";

import { useTranslations } from "next-intl";
import { CardProps } from "@/components/Card";

export default function CourseContent({ course }: { course: CardProps }) {
  const t = useTranslations("Carousel");

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-2">{t(course.titleKey)}</h1>
      <div className="mb-4">
        <span className="text-xl">Mentor: {course.mentor.name}</span>
      </div>
      <p className="text-lg">{t(course.descriptionKey)}</p>
    </div>
  );
}
