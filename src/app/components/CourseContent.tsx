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

interface CourseContentProps {
  course: CardProps;
}

export default function CourseContent({ course }: CourseContentProps) {
  const t = useTranslations("Course");
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const [relatedCourses, setRelatedCourses] = useState<CardProps[]>([]);

  useEffect(() => {
    async function fetchRelatedCourses() {
      try {
        const courses = await getCardsContent(locale);
        const filteredCourses = courses.filter((c) => c.id !== course.id);
        setRelatedCourses(filteredCourses);
      } catch (error) {
        console.error("Error fetching related courses:", error);
      }
    }
    fetchRelatedCourses();
  }, [course.id, locale]);

  return (
    <>
      <CourseDescription course={course} />
      <CourseInformation course={course} />
      <CourseContentSection />
      <RelatedTopics course={course} />
      <MentorSection course={course} />
      <TimeSelectionSection course={course} />
      <RelatedCourses relatedCourses={relatedCourses} />
      <section className="bg-background">
        <Footer />
      </section>
    </>
  );
}
