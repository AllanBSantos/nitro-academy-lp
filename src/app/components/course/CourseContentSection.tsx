import { useState } from "react";
import { useTranslations } from "next-intl";
import { CardProps } from "@/types/card";

interface CourseContentSectionProps {
  course: CardProps;
}

export default function CourseContentSection({
  course,
}: CourseContentSectionProps) {
  const [activeModules, setActiveModules] = useState<Set<string>>(
    new Set(["ementa", "aulas"])
  );
  const t = useTranslations("CourseContent");

  const hasEmenta =
    Array.isArray(course.ementa_resumida) && course.ementa_resumida.length > 0;
  const hasAulas =
    Array.isArray(course.resumo_aulas) && course.resumo_aulas.length > 0;

  // Se não houver dados, não renderiza nada
  if (!hasEmenta && !hasAulas) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">{t("title")}</h2>

        <div className="space-y-4">
          {hasEmenta && (
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  const newActiveModules = new Set(activeModules);
                  if (newActiveModules.has("ementa")) {
                    newActiveModules.delete("ementa");
                  } else {
                    newActiveModules.add("ementa");
                  }
                  setActiveModules(newActiveModules);
                }}
                className="w-full flex items-center justify-between p-6 bg-[#1e1b4b] text-white"
              >
                <h3 className="text-xl font-semibold">{t("syllabus.title")}</h3>
                <span className="text-2xl">
                  {activeModules.has("ementa") ? "−" : "+"}
                </span>
              </button>
              {activeModules.has("ementa") && (
                <div className="p-6 bg-white">
                  <ul className="space-y-3">
                    {course.ementa_resumida!.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-[#3B82F6] text-xl">•</span>
                        <span className="text-gray-700">{item.descricao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {hasAulas && (
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  const newActiveModules = new Set(activeModules);
                  if (newActiveModules.has("aulas")) {
                    newActiveModules.delete("aulas");
                  } else {
                    newActiveModules.add("aulas");
                  }
                  setActiveModules(newActiveModules);
                }}
                className="w-full flex items-center justify-between p-6 bg-[#1e1b4b] text-white"
              >
                <h3 className="text-xl font-semibold">{t("classes.title")}</h3>
                <span className="text-2xl">
                  {activeModules.has("aulas") ? "−" : "+"}
                </span>
              </button>
              {activeModules.has("aulas") && (
                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    {course.resumo_aulas!.map((aula, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold text-[#1e1b4b] mb-1">
                            {aula.nome_aula}
                          </h4>
                          <p className="text-gray-600">{aula.descricao_aula}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
