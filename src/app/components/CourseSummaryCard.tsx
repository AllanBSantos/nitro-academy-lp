import { Button } from "./ui/button";
import { CalendarDays, Video, BookOpen, Languages } from "lucide-react";

interface CourseSummaryCardProps {
  title: string;
  weeklyClasses: number;
  modelo: string;
  nivel: string;
  idioma: string;
  priceTotal: number;
  onEnrollClick: () => void;
}

export default function CourseSummaryCard({
  title,
  weeklyClasses,
  modelo,
  nivel,
  idioma,
  priceTotal,
  onEnrollClick,
}: CourseSummaryCardProps) {
  const pricePerClass = priceTotal / 8;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-[#1e1b4b] mb-3">{title}</h2>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#1e1b4b]">
              {formatPrice(pricePerClass)}
            </span>
            <span className="text-sm text-gray-600">por aula</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {weeklyClasses}{" "}
              {weeklyClasses === 1 ? "aula por semana" : "aulas por semana"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{modelo}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Nível: {nivel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Idioma: {idioma}</span>
          </div>
        </div>

        <Button
          onClick={onEnrollClick}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2"
        >
          Veja todas as turmas
        </Button>
      </div>
    </div>
  );
}
