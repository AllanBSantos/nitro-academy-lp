import { useTranslations } from "next-intl";
import { CardProps } from "@/types/card";

interface RelatedTopicsProps {
  course: CardProps;
}

export default function RelatedTopics({ course }: RelatedTopicsProps) {
  const t = useTranslations("Course");

  if (!course.topicosRelacionados || course.topicosRelacionados.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#1e1b4b] py-16 -mt-[48px]">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#3B82F6] mb-8 mt-8">
          {t("related_topics.title")}
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            {course.topicosRelacionados.map((topic: string) => (
              <button
                key={topic}
                className="px-6 py-3 rounded-full border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-colors duration-300"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
