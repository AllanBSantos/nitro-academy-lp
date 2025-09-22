import Image from "next/image";
import Link from "next/link";
import { TrailCardProps } from "../types/card";
import { Badge } from "../app/components/ui/badge";
import { useTranslations } from "next-intl";
import { normalizeTrailName } from "../lib/utils";

interface TrailCardComponentProps extends TrailCardProps {
  locale: string;
}

export default function TrailCard({
  id,
  documentId,
  nome,
  descricao,
  imagem,
  cursos,
  totalCursos,
  locale,
}: TrailCardComponentProps) {
  const t = useTranslations("TrailCard");

  const trailSlug = normalizeTrailName(nome);

  const handleTrailClick = () => {
    // Redirecionar para a página da trilha
    window.location.href = `/${locale}/trilha/${trailSlug}`;
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={handleTrailClick}
    >
      {/* Imagem da Trilha */}
      <div className="relative h-48 w-full overflow-hidden">
        {imagem ? (
          <Image
            src={imagem}
            alt={nome}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-theme-orange to-orange-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl font-bold mb-2">{totalCursos}</div>
              <div className="text-sm">{t("courses")}</div>
            </div>
          </div>
        )}

        {/* Badge com número de cursos */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-theme-orange text-white font-semibold">
            {totalCursos} {totalCursos === 1 ? t("course") : t("courses")}
          </Badge>
        </div>
      </div>

      {/* Conteúdo da Trilha */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-theme-orange transition-colors duration-200 h-14 flex items-center">
          {nome}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{descricao}</p>

        {/* Lista de cursos */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            {t("courses_included")}
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="flex items-center text-sm text-gray-600"
              >
                <div className="w-2 h-2 bg-theme-orange rounded-full mr-2 flex-shrink-0"></div>
                <span className="truncate">{curso.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de ação */}
        <div className="mt-6">
          <div className="w-full bg-theme-orange text-white text-center py-3 rounded-lg font-semibold group-hover:bg-orange-600 transition-colors duration-200">
            {t("explore_trail")}
          </div>
        </div>
      </div>
    </div>
  );
}
