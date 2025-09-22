import { Button } from "../ui/button";
import { BookOpen, Users, Clock, Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface TrailSummaryCardProps {
  title: string;
  totalCourses: number;
  description: string;
  onExploreClick: () => void;
  isMobile?: boolean;
}

export default function TrailSummaryCard({
  title,
  totalCourses,
  description,
  onExploreClick,
  isMobile = false,
}: TrailSummaryCardProps) {
  const t = useTranslations("TrailCard");

  if (isMobile) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">{t("trail_info")}</span>
            </div>
            <Button
              onClick={onExploreClick}
              className="bg-theme-orange hover:bg-orange-600 text-white py-2"
            >
              Explorar Trilha
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

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {totalCourses} {totalCourses === 1 ? "curso" : "cursos"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t("complete_trail")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {t("lifetime_access")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {t("practical_projects")}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

        <Button
          onClick={onExploreClick}
          className="w-full bg-theme-orange hover:bg-orange-600 text-white py-2"
        >
          {t("explore_trail")}
        </Button>
      </div>
    </div>
  );
}
