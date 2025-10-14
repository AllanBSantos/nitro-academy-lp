import { CardProps } from "@/types/card";
import CategoryModal from "../CategoryModal";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface CourseInformationProps {
  course: CardProps;
}

export default function CourseInformation({ course }: CourseInformationProps) {
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const t = useTranslations("CourseInformation");

  const getPreviewDescription = (text: string) => {
    if (!text) return "";
    const paragraphs = text.split("\n");
    const firstParagraph = paragraphs[0];

    if (firstParagraph.length > 100) {
      const lastSpace = firstParagraph.substring(0, 100).lastIndexOf(" ");
      const cutPoint = lastSpace > 0 ? lastSpace : 100;
      return firstParagraph.substring(0, cutPoint) + "...";
    }

    return firstParagraph;
  };

  const formatDescription = (text: string) => {
    if (!text) return "";

    const paragraphs = text.split("\n");

    return paragraphs.map((paragraph, index) => {
      if (paragraph.trim().startsWith("*")) {
        return (
          <li key={index} className="ml-4">
            {paragraph.trim().substring(1).trim()}
          </li>
        );
      }
      return <p key={index}>{paragraph}</p>;
    });
  };

  const categories = [
    {
      title: t("categories.prerequisites.title"),
      description:
        course.pre_requisitos?.replace(/\\n/g, "\n") ||
        t("categories.prerequisites.default"),
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    ...(course.competencias
      ? [
          {
            title: t("categories.competencies.title"),
            description: course.competencias,
            icon: (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            ),
          },
        ]
      : []),
    {
      title: t("categories.final_project.title"),
      description:
        course.projetos?.replace(/\\n/g, "\n") ||
        t("categories.final_project.default"),
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      title: t("categories.weekly_activities.title"),
      description:
        course.tarefa_de_casa?.replace(/\\n/g, "\n") ||
        t("categories.weekly_activities.default"),
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ].filter((category) => {
    // Filtrar pré-requisitos apenas se o campo estiver preenchido
    if (category.title === t("categories.prerequisites.title")) {
      return course.pre_requisitos && course.pre_requisitos.trim() !== "";
    }
    return true;
  });

  return (
    <>
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
            {t("title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.title}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:border-[#3B82F6] transition-colors duration-300 text-left group relative"
              >
                <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-[#3B82F6] transition-colors absolute top-2 right-4" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    {category.title}
                  </h3>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  {getPreviewDescription(category.description)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <CategoryModal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title={selectedCategory?.title || ""}
        description={
          <div className="space-y-4">
            {formatDescription(selectedCategory?.description || "")}
          </div>
        }
      />
    </>
  );
}
