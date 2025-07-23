"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Star, StarHalf } from "lucide-react";
import { useParams } from "next/navigation";
import { CardProps } from "@/types/card";

export default function Card({
  slug,
  title,
  mentor,
  image,
  cronograma,
  price,
  moeda,
  badge,
  alunos,
  data_inicio_curso,
  lingua,
}: CardProps) {
  const commonT = useTranslations("common");
  const t = useTranslations("TimeSelection");
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const studentCount = Array.isArray(alunos) ? alunos.length : 0;
  const isEnglishCourse = lingua === "ingles";

  const mentorReviews = mentor.reviews || [];
  const mentorRating =
    mentorReviews.length > 0
      ? Number(
          (
            mentorReviews.reduce((sum, r) => sum + r.nota, 0) /
            mentorReviews.length
          ).toFixed(1)
        )
      : 0;
  const mentorReviewCount = mentorReviews.length;

  const renderStars = (rating: number) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-[#FFD700] text-[#FFD700]"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 fill-[#FFD700] text-[#FFD700]"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-[#FFD700]" />
      );
    }

    return stars;
  };
  const CLASSES_PER_COURSE = 6;
  const maxStudentsPerClass = parseInt(
    process.env.NEXT_PUBLIC_MAX_STUDENTS_PER_CLASS || "10"
  );
  const faixaEtaria = cronograma?.[0]?.faixa_etaria || "";
  const priceClass =
    price && moeda
      ? (price.total / CLASSES_PER_COURSE)
          .toFixed(2)
          .replace(".", moeda === "Real" ? "," : ".")
      : null;
  const dataInicioText = data_inicio_curso || null;
  const dataInicio = data_inicio_curso || cronograma?.[0]?.data_inicio || "";

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [year, month, day] = dateString.split("-");
    const months = {
      pt: {
        "01": "Janeiro",
        "02": "Fevereiro",
        "03": "Março",
        "04": "Abril",
        "05": "Maio",
        "06": "Junho",
        "07": "Julho",
        "08": "Agosto",
        "09": "Setembro",
        "10": "Outubro",
        "11": "Novembro",
        "12": "Dezembro",
      },
      en: {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December",
      },
    };
    const currentLocale = locale === "pt" ? "pt" : "en";
    return `${day} ${currentLocale === "pt" ? "de" : ""} ${
      months[currentLocale][month as keyof typeof months.pt]
    }`;
  };

  const getDaysRemaining = (startDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isCourseStarted = (startDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    return today > start;
  };

  const renderBadge = () => {
    const badges: JSX.Element[] = [];

    if (badge && badge !== "nenhum") {
      const daysRemaining = getDaysRemaining(dataInicio);
      if (badge === "dias_faltantes" && daysRemaining < 0)
        return badges.length > 0 ? badges : null;

      const badgeText = {
        dias_faltantes: commonT("days_remaining", {
          days: daysRemaining.toString(),
        }),
        poucos_dias: commonT("few_days"),
        poucas_vagas: commonT("few_spots"),
      };

      const totalStudentsAccepted = cronograma?.length * maxStudentsPerClass;
      const availableSpots = Math.max(0, totalStudentsAccepted - studentCount);
      if (availableSpots > 0) {
        badges.push(
          <span
            key="spots"
            className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium"
          >
            {availableSpots > 7
              ? badgeText[badge]
              : availableSpots === 1
              ? "1 vaga restante"
              : `${availableSpots} vagas restantes`}
          </span>
        );
      }
    }

    return badges.length > 0 ? badges : null;
  };

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
    <Link
      id="card-link"
      href={`/${locale}/curso/${slug}`}
      className="block h-[420px] transition-transform hover:scale-[1.02] duration-200"
    >
      <div className="relative group h-full">
        <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          <div className="relative h-[140px] w-full flex-shrink-0">
            {image ? (
              <Image
                src={image}
                alt={title || ""}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  console.error("Error loading image:", image);
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}

            {/* Language label */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
              <svg
                className="w-3 h-3 text-[#3B82F6]"
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
              <span className="text-xs font-medium text-[#1e1b4b]">
                {isEnglishCourse ? "EN" : "PT-BR"}
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3 flex-grow">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <h2 className="text-lg font-bold text-gray-800 h-[3.5rem] line-clamp-2 mb-2">
                  {title}
                </h2>
                <div className="flex items-center gap-2 h-8">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={mentor.image}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-600 truncate">
                    {mentor.name}
                  </span>
                  <Image
                    src={getFlagSrc(mentor.pais)}
                    alt={mentor.pais || "Brasil"}
                    width={20}
                    height={20}
                    className="inline w-5 h-5 rounded-sm ml-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 h-5">
              {mentorRating > 0 ? (
                <>
                  <span className="text-sm text-gray-600 mr-1">
                    {mentorRating.toFixed(1)}
                  </span>
                  {renderStars(mentorRating)}
                  {mentorReviewCount > 0 && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({mentorReviewCount})
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  {commonT("new_mentor")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {faixaEtaria}
              </span>
              {renderBadge()}
            </div>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">{t("start_date")}</span>
                <span className="text-base font-bold text-theme-orange">
                  {dataInicioText ||
                    (!isCourseStarted(dataInicio)
                      ? formatDate(dataInicio)
                      : locale === "pt"
                      ? "Aulas em andamento"
                      : "Classes in progress")}
                </span>
              </div>
              <div className="flex flex-col items-end">
                {price && moeda && price.total > 0 && (
                  <>
                    <span className="text-xs text-gray-500">
                      {commonT("per_class")}
                    </span>
                    <span className="text-base font-bold text-theme-orange">
                      {moeda === "Real" ? "R$" : "USD"} {priceClass}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
