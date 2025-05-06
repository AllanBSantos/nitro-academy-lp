"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import CourseContent from "./CourseContent";
import { getCardsContent } from "@/lib/courses";
import { CardProps } from "@/types/card";

export default function CourseContentClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "pt-BR";
  const slug = params?.slug as string;

  const [course, setCourse] = useState<CardProps | null>(null);
  const [loading, setLoading] = useState(true);

  const t = useTranslations("common");

  useEffect(() => {
    async function fetchCourse() {
      try {
        const cards = await getCardsContent(locale);
        const found = cards.find((c) => c.slug === slug);
        setCourse(found || null);
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [locale, slug]);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (!course)
    return <p className="text-white text-center">{t("not_found")}</p>;

  return <CourseContent course={course} />;
}
