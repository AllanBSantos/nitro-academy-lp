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
      title: t("categories.language.title"),
      description:
        course.lingua === "ingles"
          ? t("categories.language.english")
          : t("categories.language.portuguese"),
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
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
    },
    {
      title: t("categories.level.title"),
      description: course.nivel || t("categories.level.default"),
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
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
    {
      title: t("categories.class_model.title"),
      description:
        course.modelo?.replace(/\\n/g, "\n") ||
        t("categories.class_model.default"),
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
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
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
    ...(course.ideal_para
      ? [
          {
            title: t("categories.ideal_for.title"),
            description: course.ideal_para.replace(/\\n/g, "\n"),
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
        ]
      : []),
  ];

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
