"use client";

import { useTranslations } from "next-intl";
import { CardProps } from "@/types/card";
import { getCardsContent } from "@/lib/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MAX_SLOTS_PER_COURSE } from "@/config/constants";
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
    // Garantir que a comparação funcione tanto com número quanto string
    // Filtrar apenas alunos que têm turma definida e que corresponde ao número da turma
    return alunos.filter((aluno) => {
      if (aluno.turma === undefined || aluno.turma === null) {
        return false;
      }
      const alunoTurma = typeof aluno.turma === 'string' ? parseInt(aluno.turma, 10) : Number(aluno.turma);
      return !isNaN(alunoTurma) && alunoTurma === classNumber;
    });
  }

  const getClassAvailability = (classNumber: string) => {
    const classNum = parseInt(classNumber);
    const studentsInClass = getStudentsInClass(classNum);

    // Considera turma cheia quando atingir ou ultrapassar o limite configurado
    return {
      isFull: studentsInClass.length >= MAX_SLOTS_PER_COURSE,
      currentStudents: studentsInClass.length,
      maxStudents: MAX_SLOTS_PER_COURSE,
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
              idioma={
                course.lingua === "ingles"
                  ? t("language.english")
                  : t("language.portuguese")
              }
              plano={course.plano}
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
              idioma={
                course.lingua === "ingles"
                  ? t("language.english")
                  : t("language.portuguese")
              }
              plano={course.plano}
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
