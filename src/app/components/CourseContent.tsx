"use client";

import { useTranslations } from "next-intl";
import { CardProps } from "./Card";
import { getCardsContent } from "@/lib/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TimeSelectionSection from "@/components/TimeSelectionSection";
import Footer from "@/components/Footer";
import CourseDescription from "./course/CourseDescription";
import CourseInformation from "./course/CourseInformation";
import CourseContentSection from "./course/CourseContentSection";
import RelatedTopics from "./course/RelatedTopics";
import MentorSection from "./course/MentorSection";
import RelatedCourses from "./course/RelatedCourses";
import CourseSummaryCard from "@/components/CourseSummaryCard";

interface CourseContentProps {
  course: CardProps;
}

// TODO: Fazer as traducoes
// TODO: Pegar os dados do strapi em vez de usar os mockados

export default function CourseContent({ course }: CourseContentProps) {
  const t = useTranslations("Course");
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const [relatedCourses, setRelatedCourses] = useState<CardProps[]>([]);

  useEffect(() => {
    async function fetchRelatedCourses() {
      try {
        const courses = await getCardsContent(locale);
        setRelatedCourses(courses.filter((c) => c.id !== course.id));
      } catch (error) {
        console.error("Error fetching related courses:", error);
      }
    }
    fetchRelatedCourses();
  }, [course.id, locale]);

  return (
    <>
      <CourseDescription course={course} />

      <div className="relative lg:grid lg:grid-cols-[1fr_16rem] lg:gap-8 bg-white pr-4 pt-4">
        <div>
          <CourseInformation course={course} />
          <CourseContentSection />
          <RelatedTopics course={course} />
          <MentorSection course={course} />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20 z-10">
            <CourseSummaryCard
              title={course.title}
              weeklyClasses={1}
              modelo={course.modelo}
              nivel={course.nivel}
              idioma={
                course.moeda === "Dólar"
                  ? t("language.english")
                  : t("language.portuguese")
              }
              priceTotal={course.price?.total}
              moeda={course.moeda}
              onEnrollClick={() => {
                document
                  .getElementById("time-selection")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 w-full z-10">
          <div className="bg-white p-4 border-t border-gray-200">
            <CourseSummaryCard
              title={course.title}
              weeklyClasses={1}
              modelo={course.modelo}
              nivel={course.nivel}
              idioma={
                course.moeda === "Dólar"
                  ? t("language.english")
                  : t("language.portuguese")
              }
              priceTotal={course.price?.total}
              moeda={course.moeda}
              onEnrollClick={() => {
                document
                  .getElementById("time-selection")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              isMobile={true}
            />
          </div>
        </div>
      </div>

      <div id="time-selection">
        <TimeSelectionSection course={course} />
      </div>

      <RelatedCourses relatedCourses={relatedCourses} />

      <section className="bg-background">
        <Footer />
      </section>
    </>
  );
}
