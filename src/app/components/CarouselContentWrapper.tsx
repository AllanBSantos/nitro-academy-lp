import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Carousel as CdnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CardProps } from "@/types/card";
import CardVariant from "@/components/CardVariant";
import CourseFilters from "@/components/CourseFilters";

interface CarouselContentWrapperProps {
  cardsContent: CardProps[];
  learnMoreLabel: string;
}

export function CarouselContentWrapper({
  cardsContent,
}: CarouselContentWrapperProps) {
  const t = useTranslations("Carousel");
  const [filteredCourses, setFilteredCourses] =
    useState<CardProps[]>(cardsContent);

  return (
    <div className="flex flex-col items-center bg-theme-orange py-8 sm:py-16">
      <section className="w-full max-w-[1400px] mx-auto">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="flex flex-col items-start gap-4 sm:gap-8 mb-8">
            <h2 className="font-gilroy-extrabold text-white text-4xl sm:text-5xl leading-tight">
              {t("choose_project")}
            </h2>
            <div className="w-full sm:w-[30vw] h-[1px] bg-white"></div>
          </div>

          {/* Filters */}
          <CourseFilters
            courses={cardsContent}
            onFilterChange={setFilteredCourses}
          />

          <div className="relative w-full">
            <CdnCarousel
              opts={{
                align: "start",
                loop: true,
                containScroll: "trimSnaps",
                dragFree: true,
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {filteredCourses.map((props) => (
                  <CarouselItem
                    key={props.id}
                    className="pl-2 md:pl-4 basis-[75%] md:basis-[40%] lg:basis-[25%]"
                  >
                    <div className="h-full">
                      <CardVariant
                        {...props}
                        title={props.title}
                        description={props.description}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden sm:block">
                <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-theme-orange border-2 border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transition-all duration-200" />
                <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-theme-orange border-2 border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transition-all duration-200" />
              </div>
            </CdnCarousel>
          </div>
        </div>
      </section>
    </div>
  );
}
