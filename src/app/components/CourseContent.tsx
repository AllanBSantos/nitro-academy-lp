"use client";

import { useTranslations } from "next-intl";
import { CardProps } from "@/types/card";
import { getCardsContent } from "@/lib/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TimeSelectionSection from "./TimeSelectionSection";
import Footer from "./Footer";
import CourseDescription from "./course/CourseDescription";
import CourseInformation from "./course/CourseInformation";
import CourseContentSection from "./course/CourseContentSection";
import RelatedTopics from "./course/RelatedTopics";
import MentorSection from "./course/MentorSection";
import RelatedCourses from "./course/RelatedCourses";
import CourseSummaryCard from "./CourseSummaryCard";
import { fetchAllStudents, getStudentsByCourseAndClass } from "@/lib/strapi";
import type { Student } from "@/lib/strapi";
import EnrollmentModal from "./EnrollmentModal";

interface CourseContentProps {
  course: CardProps;
}

export default function CourseContent({ course }: CourseContentProps) {
  const t = useTranslations("Course");
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const [relatedCourses, setRelatedCourses] = useState<CardProps[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const MAX_STUDENTS_PER_CLASS = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch related courses
        const courses = await getCardsContent(locale);
        setRelatedCourses(courses.filter((c) => c.id !== course.id));

        // Fetch and count students for this course
        const allStudents = await fetchAllStudents();
        setStudents(allStudents);
      } catch (err) {
        setError("Failed to load students");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [course.id, locale]);

  const getStudentsInClass = (classNumber: string) => {
    return getStudentsByCourseAndClass(
      students,
      parseInt(course.id),
      classNumber
    );
  };

  const isClassFull = (classNumber: string) => {
    const studentsInClass = getStudentsInClass(classNumber);
    return studentsInClass.length >= MAX_STUDENTS_PER_CLASS;
  };

  const handleEnrollClick = (classNumber: string) => {
    if (!isClassFull(classNumber)) {
      setSelectedClass(classNumber);
      setIsModalOpen(true);
    }
  };

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
        <TimeSelectionSection
          course={course}
          isCourseFull={false}
          currentStudents={0}
          maxStudents={MAX_STUDENTS_PER_CLASS}
          onScheduleClick={handleEnrollClick}
          isScheduleFull={isClassFull}
        />
      </div>

      <RelatedCourses relatedCourses={relatedCourses} />

      <section className="bg-background">
        <Footer />
      </section>

      {isModalOpen && selectedClass && (
        <EnrollmentModal
          courseName={course.title}
          selectedTime={
            course.cronograma[parseInt(selectedClass) - 1]?.horario || null
          }
          courseId={parseInt(course.id)}
          scheduleIndex={parseInt(selectedClass) - 1}
          link_desconto={course.link_desconto}
          cupons={course.cupons}
        />
      )}
    </>
  );
}
