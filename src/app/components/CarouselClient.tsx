"use client";

import { useTranslations } from "next-intl";
import { CarouselContentWrapper } from "./CarouselContentWrapper";

export default function CarouselClient({ locale }: { locale: string }) {
  const t = useTranslations("Carousel");

  return (
    <CarouselContentWrapper
      locale={locale}
      learnMoreLabel={t("learn_more")}
      chooseProjectLabel={t("choose_project")}
    />
  );
}
