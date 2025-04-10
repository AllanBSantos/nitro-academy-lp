"use client";

import { useTranslations } from "next-intl";
import { CarouselContentWrapper } from "./Carousel";

export default function CarouselClient({ locale }: { locale: string }) {
  const t = useTranslations("Carousel");
  return <CarouselContentWrapper locale={locale} t={t} />;
}
