"use client";

import { useTranslations } from "next-intl";
import { CardProps } from "@/types/card";
import { getCardsContent } from "@/lib/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TimeSelectionSection from "./TimeSelectionSection";
import CourseDescription from "./course/CourseDescription";
import CourseInformation from "./course/CourseInformation";
import CourseContentSection from "./course/CourseContentSection";
import RelatedTopics from "./course/RelatedTopics";
import MentorSection from "./course/MentorSection";
import RelatedCourses from "./course/RelatedCourses";
import CourseSummaryCard from "./CourseSummaryCard";
import CourseRatingSection, { Review } from "./course/CourseRatingSection";
import CourseReviewsSection from "./course/CourseReviewsSection";

interface CourseContentProps {
  course: CardProps;
}

export default function CourseContent({ course }: CourseContentProps) {
  const t = useTranslations("Course");
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const [relatedCourses, setRelatedCourses] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const maxStudentsPerClass = parseInt(
    process.env.NEXT_PUBLIC_MAX_STUDENTS_PER_CLASS || "15"
  );
  const alunos = Array.isArray(course.alunos) ? course.alunos : [];

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch related courses
        const courses = await getCardsContent(locale);
        setRelatedCourses(courses.filter((c) => c.id !== course.id));
      } catch (err) {
        setError("Failed to load students");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [course.id, locale]);

  function getStudentsInClass(classNumber: number) {
    return alunos.filter((aluno) => aluno.turma === classNumber);
  }

  const getClassAvailability = (classNumber: string) => {
    const studentsInClass = getStudentsInClass(parseInt(classNumber));
    // const turma = course.turmas?.find((t) => String(t.id) === classNumber);

    // Considera turma cheia quando atingir o limite configurado
    return {
      isFull: studentsInClass.length > maxStudentsPerClass,
      currentStudents: studentsInClass.length,
      maxStudents: maxStudentsPerClass,
    };
  };

  const isClassFull = (classNumber: string) => {
    const { isFull } = getClassAvailability(classNumber);
    return isFull;
  };

  const handleEnrollClick = (classNumber: string) => {
    // Removida a verificação de vagas disponíveis - sempre permite matrícula
    setSelectedClass(classNumber);
    setIsModalOpen(true);
  };

  const reviews: Review[] = course.reviews || [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <CourseDescription course={course} />

      <div className="relative lg:grid lg:grid-cols-[1fr_16rem] lg:gap-8 bg-white pr-4 pt-4">
        <div>
          <CourseInformation course={course} />
          <CourseContentSection course={course} />
          <RelatedTopics course={course} />
          <MentorSection course={course} />
          <CourseRatingSection reviews={reviews} />
          <CourseReviewsSection reviews={reviews} />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20 z-10">
            <CourseSummaryCard
              title={course.title}
              weeklyClasses={1}
              modelo={course.modelo}
              nivel={course.nivel}
              idioma={
                course.lingua === "ingles"
                  ? t("language.english")
                  : t("language.portuguese")
              }
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
                course.lingua === "ingles"
                  ? t("language.english")
                  : t("language.portuguese")
              }
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
        <TimeSelectionSection
          inscricoes_abertas={course.inscricoes_abertas}
          course={course}
          onScheduleClick={handleEnrollClick}
          isScheduleFull={isClassFull}
        />
      </div>

      <RelatedCourses relatedCourses={relatedCourses} />
    </>
  );
}
