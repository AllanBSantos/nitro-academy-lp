import Image from "next/image";
import Link from "next/link";
import { TrailCardProps } from "@/types/card";
import { useTranslations } from "next-intl";

interface TrailCoursesListProps {
  trail: TrailCardProps;
}

export default function TrailCoursesList({ trail }: TrailCoursesListProps) {
  const t = useTranslations("TrailCard");

  const getFlagSrc = (pais?: string) => {
    const brazilFlag = "/en/brasil-flag.png";
    const usaFlag = "/en/usa-flag.png";
    const canadaFlag = "/en/canada-flag.png";
    const franceFlag = "/en/france-flag.png";
    switch ((pais || "Brasil").toLowerCase()) {
      case "brasil":
        return brazilFlag;
      case "estados unidos":
        return usaFlag;
      case "canadá":
      case "canada":
        return canadaFlag;
      case "frança":
        return franceFlag;
      default:
        return brazilFlag;
    }
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
          {t("trail_courses")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trail.cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1e1b4b] flex-1">
                    {curso.title}
                  </h3>
                  <Link
                    href={`/pt/curso/${curso.slug}`}
                    className="text-theme-orange hover:text-orange-600 font-semibold text-sm ml-4"
                  >
                    {t("view_details")} →
                  </Link>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {curso.description}
                </p>

                {/* Informações do curso */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{t("level")}:</span>
                    <span>{curso.nivel || "Aberto a todos"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{t("language.label")}:</span>
                    <span>
                      {curso.lingua === "ingles"
                        ? t("language.english")
                        : t("language.portuguese")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{t("model")}:</span>
                    <span>{curso.modelo || "Projetos + Discussão"}</span>
                  </div>
                </div>

                {/* Mentor do curso */}
                {curso.mentor && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={curso.mentor.image}
                          alt={curso.mentor.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-[#1e1b4b]">
                            {curso.mentor.name}
                          </h4>
                          <Image
                            src={getFlagSrc(curso.mentor.pais)}
                            alt={curso.mentor.pais || "Brasil"}
                            width={16}
                            height={16}
                            className="w-4 h-4 rounded-sm"
                          />
                        </div>
                        {curso.mentor.profissao && (
                          <p className="text-sm text-gray-600">
                            {curso.mentor.profissao}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-1">
                          {curso.mentor.students > 0 && (
                            <span className="text-xs text-gray-500">
                              {curso.mentor.students} {t("students")}
                            </span>
                          )}
                          {curso.mentor.courses > 0 && (
                            <span className="text-xs text-gray-500">
                              {curso.mentor.courses} {t("courses")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
