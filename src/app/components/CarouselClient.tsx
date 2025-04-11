"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getCardsContent } from "@/lib/courses";
import { CardProps } from "@/components/Card";
import { CarouselContentWrapper } from "./CarouselContentWrapper";

export default function CarouselClient({ locale }: { locale: string }) {
  const t = useTranslations("Carousel");
  const [cardsContent, setCardsContent] = useState<CardProps[]>([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCardsContent(locale);
        setCardsContent(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    }

    loadCourses();
  }, [locale]);

  return (
    <CarouselContentWrapper
      cardsContent={cardsContent}
      learnMoreLabel={t("learn_more")}
      chooseProjectLabel={t("choose_project")}
    />
  );
}
