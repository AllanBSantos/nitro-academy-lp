import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { getCardsContent } from "@/lib/courses";
import { CardProps } from "@/types/card";
import { useTranslations, useLocale } from "next-intl";

export function Projects() {
  const t = useTranslations("NewHome.Projects");
  const locale = useLocale();

  // Fetch courses from Strapi using existing function
  const [courses, setCourses] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedDay, setSelectedDay] = useState("todos");
  const [selectedTime, setSelectedTime] = useState("todos");
  const [selectedLanguage, setSelectedLanguage] = useState("todos");
  const [selectedMentor, setSelectedMentor] = useState("todos");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(6);

  // Load courses on component mount
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCardsContent(locale);
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError(t("errors.generic"));
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [locale, t]);

  // Filter options
  const days = useMemo(
    () => [
      { value: "todos", label: t("filters.allDays") },
      { value: "segunda", label: t("filters.days.monday") },
      { value: "terca", label: t("filters.days.tuesday") },
      { value: "quarta", label: t("filters.days.wednesday") },
      { value: "quinta", label: t("filters.days.thursday") },
      { value: "sexta", label: t("filters.days.friday") },
      { value: "sabado", label: t("filters.days.saturday") },
      { value: "domingo", label: t("filters.days.sunday") },
    ],
    [t]
  );

  const times = useMemo(
    () => [
      { value: "todos", label: t("filters.allTimes") },
      { value: "manhã", label: t("filters.periods.morning") },
      { value: "tarde", label: t("filters.periods.afternoon") },
      { value: "noite", label: t("filters.periods.evening") },
      { value: "14h", label: "14h" },
      { value: "15h", label: "15h" },
      { value: "16h", label: "16h" },
      { value: "17h", label: "17h" },
      { value: "18h", label: "18h" },
      { value: "19h", label: "19h" },
      { value: "20h", label: "20h" },
    ],
    [t]
  );

  const languages = useMemo(
    () => [
      { value: "todos", label: t("filters.allLanguages") },
      { value: "portugues", label: t("filters.languages.portuguese") },
      { value: "ingles", label: t("filters.languages.english") },
      { value: "espanhol", label: t("filters.languages.spanish") },
    ],
    [t]
  );

  // Generate mentors list from actual courses
  const mentors = useMemo(
    () => [
      { value: "todos", label: t("filters.allMentors") },
      ...Array.from(
        new Map(
          courses
            .filter((course) => course.mentor?.name)
            .map((course) => {
              const label = course.mentor!.name;
              return [label.toLowerCase().replace(/\s+/g, "-"), label] as const;
            })
        )
      ).map(([value, label]) => ({ value, label })),
    ],
    [courses, t]
  );

  const dateLocale = locale === "pt" ? "pt-BR" : "en-US";

  const getLanguageBadge = (language: string) => {
    switch (language) {
      case "ingles":
        return "EN";
      case "espanhol":
        return "ES";
      default:
        return "PT-BR";
    }
  };

  const getLanguageTooltip = (language: string) => {
    switch (language) {
      case "ingles":
        return t("language.tooltip.english");
      case "espanhol":
        return t("language.tooltip.spanish");
      default:
        return t("language.tooltip.portuguese");
    }
  };

  const getPlanTooltip = (planType: string | undefined) => {
    if (planType === "black") {
      return t("plans.black");
    }
    return t("plans.gold");
  };

  // Helper function to remove accents for search
  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Transform CardProps to the format expected by the component
  const transformCourseToProject = (course: CardProps) => {
    const cronograma = Array.isArray(course.cronograma)
      ? course.cronograma[0]
      : course.cronograma;

    // Map day names
    const dayMap: Record<string, string> = {
      "Segunda-Feira": "segunda",
      "Terça-Feira": "terca",
      "Quarta-Feira": "quarta",
      "Quinta-Feira": "quinta",
      "Sexta-Feira": "sexta",
      "Sábado": "sabado",
      "Sabado": "sabado",
      "Domingo": "domingo",
      Monday: "segunda",
      Tuesday: "terca",
      Wednesday: "quarta",
      Thursday: "quinta",
      Friday: "sexta",
      Saturday: "sabado",
      Sunday: "domingo",
    };

    // Extract time from schedule
    const timeMatch = cronograma?.horario_aula?.match(/(\d{2}):(\d{2})/);
    const time = timeMatch ? `${timeMatch[1]}h` : "14h";

    // Map language
    const languageMap: Record<string, string> = {
      portugues: "portugues",
      "português": "portugues",
      portuguese: "portugues",
      ingles: "ingles",
      english: "ingles",
      espanhol: "espanhol",
      spanish: "espanhol",
    };

    // Map mentor name to slug
    const mentorSlug =
      course.mentor?.name?.toLowerCase().replace(/\s+/g, "-") || "mentor";

    // Determine category based on course tags - use specific tag or fallback to first available tag
    const category =
      course.tags && course.tags.length > 0
        ? course.tags[0].nome
        : t("fallbacks.category");

    // Format start date
    const startDate = cronograma?.data_inicio
      ? new Date(cronograma.data_inicio).toLocaleDateString(dateLocale, {
          month: "long",
          year: "2-digit",
        })
      : t("labels.defaultStartDate");

    return {
      id: course.id,
      documentId: course.documentId,
      title: course.title || t("fallbacks.courseTitle"),
      description: course.description || t("fallbacks.courseDescription"),
      category,
      day: cronograma?.dia_semana
        ? dayMap[cronograma.dia_semana] || "segunda"
        : "segunda",
      time,
      startDate,
      language: languageMap[course.lingua || "portugues"] || "portugues",
      mentor: mentorSlug,
      mentorName: course.mentor?.name || t("mentor.placeholder"),
      mentorPhoto:
        course.mentor?.image ||
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      mentorCountry: course.mentor?.pais || "BR",
      mentorRating:
        course.mentor?.reviews && course.mentor.reviews.length > 0
          ? course.mentor.reviews[0].nota
          : null,
      mentorReviews: course.mentor?.reviews?.length || 0,
      planType: course.plano || "gold",
      image:
        course.image ||
        "https://images.unsplash.com/photo-1712903911017-7c10a3c4b3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvamVjdCUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NTk5OTE2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      slug: course.slug,
      link_pagamento: course.link_pagamento,
      preco: course.price?.total || 0,
      parcelas: course.price?.installments || 1,
      moeda: course.moeda || "Real",
      inscricoes_abertas: course.inscricoes_abertas || false,
    };
  };

  // Use real courses from Strapi or fallback to mock data
  const projects =
    loading || error || courses.length === 0
      ? []
      : courses.map(transformCourseToProject);

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    const matchesName = removeAccents(project.title).includes(
      removeAccents(searchName)
    );
    const matchesDay = selectedDay === "todos" || project.day === selectedDay;
    const matchesTime =
      selectedTime === "todos" || project.time === selectedTime;
    const matchesLanguage =
      selectedLanguage === "todos" || project.language === selectedLanguage;
    const matchesMentor =
      selectedMentor === "todos" || project.mentor === selectedMentor;

    return (
      matchesName &&
      matchesDay &&
      matchesTime &&
      matchesLanguage &&
      matchesMentor
    );
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchName("");
    setSelectedDay("todos");
    setSelectedTime("todos");
    setSelectedLanguage("todos");
    setSelectedMentor("todos");
    setDisplayedCount(6);
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchName !== "" ||
    selectedDay !== "todos" ||
    selectedTime !== "todos" ||
    selectedLanguage !== "todos" ||
    selectedMentor !== "todos";

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(6);
  }, [searchName, selectedDay, selectedTime, selectedLanguage, selectedMentor]);

  // Helper function to get country flag emoji
  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      BR: "🇧🇷",
      Brasil: "🇧🇷",
      PT: "🇵🇹",
      Portugal: "🇵🇹",
      US: "🇺🇸",
      "Estados Unidos": "🇺🇸",
      USA: "🇺🇸",
      CA: "🇨🇦",
      Canadá: "🇨🇦",
      Canada: "🇨🇦",
      ES: "🇪🇸",
      Espanha: "🇪🇸",
      UK: "🇬🇧",
      "Reino Unido": "🇬🇧",
      Inglaterra: "🇬🇧",
      FR: "🇫🇷",
      França: "🇫🇷",
      France: "🇫🇷",
      DE: "🇩🇪",
      Alemanha: "🇩🇪",
      Germany: "🇩🇪",
      IT: "🇮🇹",
      Itália: "🇮🇹",
      Italy: "🇮🇹",
      AR: "🇦🇷",
      Argentina: "🇦🇷",
      MX: "🇲🇽",
      México: "🇲🇽",
      Mexico: "🇲🇽",
      CL: "🇨🇱",
      Chile: "🇨🇱",
      CO: "🇨🇴",
      Colômbia: "🇨🇴",
      Colombia: "🇨🇴",
    };
    return flags[countryCode] || "🌍";
  };

  return (
    <section id="projetos" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl text-[#19184b]">
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-[#f54a12]">{chunks}</span>
              ),
            })}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f54a12]/10 rounded-lg">
                  <SlidersHorizontal className="w-5 h-5 text-[#f54a12]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#19184b]">
                    {t("filters.title")}
                  </h3>
                  <p className="hidden md:block text-sm text-gray-500">
                    {hasActiveFilters
                      ? t("filters.activeCount", {
                          count: [
                            searchName !== "",
                            selectedDay !== "todos",
                            selectedTime !== "todos",
                            selectedLanguage !== "todos",
                            selectedMentor !== "todos",
                          ].filter(Boolean).length,
                        })
                      : t("filters.hint")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-[#f54a12] hover:text-[#d43e0f] hover:bg-[#f54a12]/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t("filters.clear")}
                  </Button>
                )}

                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#19184b] hover:bg-gray-100"
                  >
                    {isFiltersOpen ? (
                      <>
                        <ChevronUp className="w-5 h-5 mr-2" />
                        {t("filters.hide")}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5 mr-2" />
                        {t("filters.show")}
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Collapsible Filter Content */}
            <CollapsibleContent>
              <div className="p-6 pt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* Search by Name */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      {t("filters.labels.projectName")}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={t("filters.placeholders.search")}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="pl-10 bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Day of Week */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      {t("filters.labels.day")}
                    </label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900">
                        <SelectValue placeholder={t("filters.placeholders.day")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      {t("filters.labels.time")}
                    </label>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900">
                        <SelectValue placeholder={t("filters.placeholders.time")} />
                      </SelectTrigger>
                      <SelectContent>
                        {times.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      {t("filters.labels.language")}
                    </label>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900">
                        <SelectValue placeholder={t("filters.placeholders.language")} />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mentor */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700 font-medium">
                      {t("filters.labels.mentor")}
                    </label>
                    <Select
                      value={selectedMentor}
                      onValueChange={setSelectedMentor}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#f54a12] focus:ring-[#f54a12] transition-all text-gray-900">
                        <SelectValue placeholder={t("filters.placeholders.mentor")} />
                      </SelectTrigger>
                      <SelectContent>
                        {mentors.map((mentor) => (
                          <SelectItem key={mentor.value} value={mentor.value}>
                            {mentor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active filters badges */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      {t("filters.activeLabel")}
                    </span>
                    {searchName !== "" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f54a12]/10 text-[#f54a12] rounded-full text-sm">
                        <Search className="w-3 h-3" />
                        {searchName}
                        <button
                          onClick={() => setSearchName("")}
                          className="ml-1 hover:bg-[#f54a12]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedDay !== "todos" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-sm">
                        {days.find((d) => d.value === selectedDay)?.label}
                        <button
                          onClick={() => setSelectedDay("todos")}
                          className="ml-1 hover:bg-[#599fe9]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedTime !== "todos" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-sm">
                        {times.find((t) => t.value === selectedTime)?.label}
                        <button
                          onClick={() => setSelectedTime("todos")}
                          className="ml-1 hover:bg-[#599fe9]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedLanguage !== "todos" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-sm">
                        {
                          languages.find((l) => l.value === selectedLanguage)
                            ?.label
                        }
                        <button
                          onClick={() => setSelectedLanguage("todos")}
                          className="ml-1 hover:bg-[#599fe9]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedMentor !== "todos" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-sm">
                        {mentors.find((m) => m.value === selectedMentor)?.label}
                        <button
                          onClick={() => setSelectedMentor("todos")}
                          className="ml-1 hover:bg-[#599fe9]/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>

            {/* Results count - Always visible */}
            <div className="px-5 py-3 bg-white/60 backdrop-blur-sm border-t border-gray-200 text-center text-sm text-gray-600">
              {filteredProjects.length === projects.length ? (
                <span>
                  {t("results.all", { count: filteredProjects.length })}
                </span>
              ) : (
                <span>
                  {t("results.filtered", {
                    count: filteredProjects.length,
                    total: projects.length,
                  })}
                </span>
              )}
            </div>
          </div>
        </Collapsible>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f54a12]"></div>
              {t("messages.loading")}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-medium">{t("errors.title")}</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-[#f54a12] text-[#f54a12] hover:bg-[#f54a12] hover:text-white"
            >
              {t("errors.retry")}
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 ? (
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredProjects
                .slice(0, displayedCount)
                .map((project, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Language Badge - Top Left */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
                            {getLanguageBadge(project.language)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getLanguageTooltip(project.language)}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`absolute top-4 right-4 w-8 h-8 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                              project.planType === "gold"
                                ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"
                                : "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
                            }`}
                          >
                            <span className="text-white text-xs">
                              {project.planType === "gold" ? "G" : "B"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getPlanTooltip(project.planType)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl text-[#19184b] mb-2">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-500">
                        <span className="inline-flex items-center">
                          📅 {days.find((d) => d.value === project.day)?.label}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center">
                          🕐 {project.time}
                        </span>
                      </div>
                      <div className="mb-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <span className="font-medium">{t("labels.starts")}</span>{" "}
                          {project.startDate}
                        </span>
                      </div>

                      {/* Mentor Section */}
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        {project.mentorName &&
                        project.mentorName !== "Mentor" ? (
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <ImageWithFallback
                                src={project.mentorPhoto}
                                alt={project.mentorName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                              />
                              <span className="absolute -bottom-1 -right-1 text-lg">
                                {getCountryFlag(project.mentorCountry)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-[#19184b]">
                                {project.mentorName}
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                {project.mentorRating &&
                                project.mentorReviews > 0 ? (
                                  <>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                      <Star className="w-4 h-4 fill-current" />
                                      <span className="text-[#19184b]">
                                        {project.mentorRating}
                                      </span>
                                    </div>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500">
                                      {t("mentor.reviews", {
                                        count: project.mentorReviews,
                                      })}
                                    </span>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                    {t("mentor.new")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200">
                              <span className="text-gray-400 text-lg">👥</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">
                                {t("mentor.pending")}
                              </p>
                              <p className="text-xs text-gray-400">
                                {t("mentor.comingSoon")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/${locale}/curso/${project.slug}`}
                        className="flex items-center gap-2 text-[#f54a12] group-hover:gap-3 transition-all duration-300"
                      >
                        {t("cta.learnMore")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </TooltipProvider>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl text-[#19184b] mb-2">
              {t("empty.title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("empty.description")}
            </p>
            <Button
              onClick={clearFilters}
              className="bg-[#f54a12] hover:bg-[#d43e0f] text-white"
            >
              {t("empty.clear")}
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {filteredProjects.length > displayedCount && (
          <div className="text-center">
            <Button
              onClick={() => setDisplayedCount((prev) => prev + 6)}
              className="bg-[#f54a12] hover:bg-[#d43e0f] text-white px-8 py-6 rounded-xl"
            >
              {t("cta.loadMore")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
