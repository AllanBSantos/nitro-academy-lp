"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getCardsContent } from "@/lib/courses";
import { CardProps } from "@/types/card";
import {
  Carousel as CdnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import CardVariant from "@/app/components/CardVariant";

interface PlanCarouselProps {
  locale: string;
  planType: "gold" | "black";
}

export default function PlanCarousel({ locale, planType }: PlanCarouselProps) {
  const t = useTranslations("common");
  const [courses, setCourses] = useState<CardProps[]>([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCardsContent(locale);
        // Filtrar cursos por plano
        const filteredCourses = data.filter((course) => {
          if (!course.plano) return false;
          return course.plano.toLowerCase().trim() === planType;
        });
        setCourses(filteredCourses);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    }

    loadCourses();
  }, [locale, planType]);

  const planTitle = planType === "gold" ? t("plan_gold") : t("plan_black");
  const planTextColor =
    planType === "gold" ? "text-yellow-800" : "text-gray-800";
  const planBorderColor =
    planType === "gold" ? "border-yellow-200" : "border-gray-200";

  if (courses.length === 0) {
    return null; // Não renderiza se não houver cursos do plano
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header da seção */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 ${planBorderColor} ${planTextColor} bg-white shadow-sm`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                planType === "gold" ? "bg-yellow-400" : "bg-gray-600"
              }`}
            ></div>
            <h3 className="text-2xl sm:text-3xl font-bold">{planTitle}</h3>
            <div
              className={`w-3 h-3 rounded-full ${
                planType === "gold" ? "bg-yellow-400" : "bg-gray-600"
              }`}
            ></div>
          </div>
          {planType === "black" && (
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              {t("plan_black_description")}
            </p>
          )}
        </div>

        {/* Carrossel */}
        <div className="relative w-full">
          <CdnCarousel
            opts={{
              align: "start",
              loop: true,
              containScroll: "keepSnaps",
              dragFree: true,
              slidesToScroll: 1,
            }}
            className="w-full overflow-visible"
          >
            <CarouselContent className="-ml-2 md:-ml-4 pr-4 md:pr-12 lg:pr-16">
              {courses.map((course) => (
                <CarouselItem
                  key={course.id}
                  className="pl-2 md:pl-4 basis-[90%] md:basis-[40%] lg:basis-[25%]"
                >
                  <div className="h-full">
                    <CardVariant
                      {...course}
                      title={course.title}
                      description={course.description}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious
                className={`absolute -left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white ${
                  planType === "gold" ? "text-yellow-600" : "text-gray-600"
                } border-2 border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transition-all duration-200`}
              />
              <CarouselNext
                className={`absolute -right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white ${
                  planType === "gold" ? "text-yellow-600" : "text-gray-600"
                } border-2 border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transition-all duration-200`}
              />
            </div>
          </CdnCarousel>
        </div>
      </div>
    </div>
  );
}
