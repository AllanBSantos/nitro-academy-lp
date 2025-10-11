import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import CardVariant from "../CardVariant";
import { CardProps } from "@/types/card";

interface RelatedCoursesProps {
  relatedCourses: CardProps[];
}

export default function RelatedCourses({
  relatedCourses,
}: RelatedCoursesProps) {
  const t = useTranslations("Course");

  if (relatedCourses.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1e1b4b]">
      <section className="w-full bg-theme-orange py-16 rounded-[24px] rounded-t-none">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
            {t("you_may_also_like")}
          </h2>

          <div className="relative">
            <Carousel
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
                {relatedCourses.map((relatedCourse) => (
                  <CarouselItem
                    key={relatedCourse.id}
                    className="pl-2 md:pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]"
                  >
                    <CardVariant
                      {...relatedCourse}
                      title={relatedCourse.title}
                      description={relatedCourse.description}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
              <CarouselNext className="absolute -right-4 lg:-right-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  );
}
