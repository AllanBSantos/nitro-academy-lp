import { Button } from "./ui/button";
import { CalendarDays, Video, BookOpen, Languages } from "lucide-react";
import { useTranslations } from "next-intl";

interface CourseSummaryCardProps {
  title: string;
  weeklyClasses: number;
  modelo: string;
  nivel: string;
  idioma: string;
  priceTotal: number;
  moeda: "Real" | "Dólar";
  onEnrollClick: () => void;
  isMobile?: boolean;
}

export default function CourseSummaryCard({
  title,
  weeklyClasses,
  modelo,
  nivel,
  idioma,
  priceTotal,
  moeda,
  onEnrollClick,
  isMobile = false,
}: CourseSummaryCardProps) {
  const t = useTranslations("CourseSummaryCard");
  const pricePerClass = priceTotal / 8;

  const formatPrice = (price: number) => {
    if (moeda === "Dólar") {
      return `USD ${price.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  if (isMobile) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[#1e1b4b]">
                {formatPrice(pricePerClass)}
              </span>
              <span className="text-sm text-gray-600 ml-2">
                {t("per_class")}
              </span>
            </div>
            <Button
              onClick={onEnrollClick}
              className="bg-orange-600 hover:bg-orange-500 text-white py-2"
            >
              {t("see_classes_mobile")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-[#1e1b4b] mb-3">{title}</h2>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#1e1b4b]">
              {formatPrice(pricePerClass)}
            </span>
            <span className="text-sm text-gray-600">{t("per_class")}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {weeklyClasses}{" "}
              {weeklyClasses === 1
                ? t("classes_per_week.one")
                : t("classes_per_week.other")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{modelo}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {t("level")}: {nivel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {t("language")}: {idioma}
            </span>
          </div>
        </div>

        <Button
          onClick={onEnrollClick}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2"
        >
          {t("see_classes")}
        </Button>
      </div>
    </div>
  );
}
