import { CardProps } from "../Card";
import CategoryModal from "../CategoryModal";
import { useState } from "react";

interface CourseInformationProps {
  course: CardProps;
}

export default function CourseInformation({ course }: CourseInformationProps) {
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const getPreviewDescription = (text: string) => {
    if (!text) return "";
    const paragraphs = text.split("\n");
    return paragraphs[0];
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
      title: "Nível",
      description: course.nivel || "Aberto a todos",
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
      title: "Pré-requisitos",
      description:
        course.pre_requisitos?.replace(/\\n/g, "\n") ||
        "Nenhum — só vontade de aprender!",
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
      title: "Competências Desenvolvidas",
      description:
        course.competencias?.replace(/\\n/g, "\n") ||
        "Criatividade, pensamento crítico, resolução de problemas",
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
    {
      title: "Projeto Final",
      description:
        course.projetos?.replace(/\\n/g, "\n") ||
        "Projeto prático aplicando os conhecimentos adquiridos",
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
      title: "Modelo da Aula",
      description:
        course.modelo?.replace(/\\n/g, "\n") ||
        "Aulas online ao vivo com atividades práticas",
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
    {
      title: "Atividades Semanais",
      description:
        course.tarefa_de_casa?.replace(/\\n/g, "\n") ||
        "Projetos práticos para fixação do conteúdo",
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
    {
      title: "Ideal para jovens que...",
      description:
        course.ideal_para?.replace(/\\n/g, "\n") ||
        "Querem desenvolver habilidades práticas e criativas",
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
  ];

  return (
    <>
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
            Informações do curso
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.title}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:border-[#3B82F6] transition-colors duration-300 text-left"
              >
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
