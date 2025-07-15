"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CardProps } from "@/types/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, Filter, ChevronUp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface CourseFiltersProps {
  courses: CardProps[];
  onFilterChange: (filteredCourses: CardProps[]) => void;
}

const ALL_DAYS = [
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
];

const ALL_TIMES = [
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export default function CourseFilters({
  courses,
  onFilterChange,
}: CourseFiltersProps) {
  const t = useTranslations("CourseFilters");

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);

  // Get unique values for filters
  const uniqueLanguages = useMemo(() => {
    const languages = new Set<string>();
    courses.forEach((course) => {
      if (course.lingua) {
        languages.add(course.lingua);
      }
    });
    return Array.from(languages).sort();
  }, [courses]);

  const uniqueMentors = useMemo(() => {
    const mentors = new Set<string>();
    courses.forEach((course) => {
      if (course.mentor?.name) {
        mentors.add(course.mentor.name);
      }
    });
    return Array.from(mentors).sort();
  }, [courses]);

  // Apply filters
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search by name
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by day
      const matchesDay =
        selectedDays.length === 0 ||
        course.cronograma?.some(
          (schedule) =>
            schedule.dia_semana && selectedDays.includes(schedule.dia_semana)
        );

      // Filter by time
      const matchesTime =
        selectedTimes.length === 0 ||
        course.cronograma?.some(
          (schedule) =>
            schedule.horario_aula &&
            selectedTimes.includes(schedule.horario_aula)
        );

      // Filter by language
      const matchesLanguage =
        selectedLanguages.length === 0 ||
        (course.lingua && selectedLanguages.includes(course.lingua));

      // Filter by mentor
      const matchesMentor =
        selectedMentors.length === 0 ||
        (course.mentor?.name && selectedMentors.includes(course.mentor.name));

      return (
        matchesSearch &&
        matchesDay &&
        matchesTime &&
        matchesLanguage &&
        matchesMentor
      );
    });
  }, [
    courses,
    searchTerm,
    selectedDays,
    selectedTimes,
    selectedLanguages,
    selectedMentors,
  ]);

  // Update parent component when filters change
  useMemo(() => {
    onFilterChange(filteredCourses);
  }, [filteredCourses, onFilterChange]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDays([]);
    setSelectedTimes([]);
    setSelectedLanguages([]);
    setSelectedMentors([]);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedDays.length > 0 ||
    selectedTimes.length > 0 ||
    selectedLanguages.length > 0 ||
    selectedMentors.length > 0;

  const activeFiltersCount = [
    searchTerm ? 1 : 0,
    selectedDays.length,
    selectedTimes.length,
    selectedLanguages.length,
    selectedMentors.length,
  ].reduce((sum, count) => sum + count, 0);

  const handleDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setSelectedDays((prev) => [...prev, day]);
    } else {
      setSelectedDays((prev) => prev.filter((d) => d !== day));
    }
  };

  const handleTimeChange = (time: string, checked: boolean) => {
    if (checked) {
      setSelectedTimes((prev) => [...prev, time]);
    } else {
      setSelectedTimes((prev) => prev.filter((t) => t !== time));
    }
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setSelectedLanguages((prev) => [...prev, language]);
    } else {
      setSelectedLanguages((prev) => prev.filter((l) => l !== language));
    }
  };

  const handleMentorChange = (mentor: string, checked: boolean) => {
    if (checked) {
      setSelectedMentors((prev) => [...prev, mentor]);
    } else {
      setSelectedMentors((prev) => prev.filter((m) => m !== mentor));
    }
  };

  // Adicione um objeto de mapeamento:
  const DAY_LABELS: Record<string, string> = {
    "Segunda-Feira": t("monday"),
    "Terça-Feira": t("tuesday"),
    "Quarta-Feira": t("wednesday"),
    "Quinta-Feira": t("thursday"),
    "Sexta-Feira": t("friday"),
  };

  return (
    <div className="w-full mb-8">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
        {/* Collapsed State - Filter Button */}
        {!isExpanded && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 rounded-xl py-3 px-6 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              {t("filters")}
              {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
            </button>

            {/* Results count */}
            <div className="text-sm text-white/80 font-medium text-center sm:text-left">
              {t("results_count", {
                count: filteredCourses.length,
                total: courses.length,
              })}
            </div>
          </div>
        )}

        {/* Expanded State - All Filters */}
        {isExpanded && (
          <div className="space-y-6">
            {/* Header with close button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsExpanded(false)}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 rounded-xl py-3 px-6 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">
                  {t("filters")}
                  {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
                </span>
                <ChevronUp className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search by name */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <Input
                    placeholder={t("search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 transition-all duration-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Day filter */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 rounded-xl py-3"
                    >
                      {selectedDays.length === 0 ? (
                        t("day_placeholder")
                      ) : (
                        <div className="flex flex-wrap gap-1 items-center">
                          <Badge variant="secondary" className="text-xs">
                            {DAY_LABELS[selectedDays[0]] || selectedDays[0]}
                          </Badge>
                          {selectedDays.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              +{selectedDays.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-white border-gray-200">
                    <div className="space-y-2">
                      {ALL_DAYS.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day}`}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={(checked) =>
                              handleDayChange(day, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`day-${day}`}
                            className="text-sm font-medium"
                          >
                            {DAY_LABELS[day] || day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time filter */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 rounded-xl py-3"
                    >
                      {selectedTimes.length === 0 ? (
                        t("time_placeholder")
                      ) : (
                        <div className="flex flex-wrap gap-1 items-center">
                          <Badge variant="secondary" className="text-xs">
                            {selectedTimes[0]}
                          </Badge>
                          {selectedTimes.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              +{selectedTimes.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-white border-gray-200">
                    <div className="space-y-2">
                      {ALL_TIMES.map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <Checkbox
                            id={`time-${time}`}
                            checked={selectedTimes.includes(time)}
                            onCheckedChange={(checked) =>
                              handleTimeChange(time, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`time-${time}`}
                            className="text-sm font-medium"
                          >
                            {time}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Language filter */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 rounded-xl py-3"
                    >
                      {selectedLanguages.length === 0 ? (
                        t("language_placeholder")
                      ) : (
                        <div className="flex flex-wrap gap-1 items-center">
                          <Badge variant="secondary" className="text-xs">
                            {selectedLanguages[0] === "portugues"
                              ? t("portuguese")
                              : t("english")}
                          </Badge>
                          {selectedLanguages.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              +{selectedLanguages.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-white border-gray-200">
                    <div className="space-y-2">
                      {uniqueLanguages.map((language) => (
                        <div
                          key={language}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`language-${language}`}
                            checked={selectedLanguages.includes(language)}
                            onCheckedChange={(checked) =>
                              handleLanguageChange(language, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`language-${language}`}
                            className="text-sm font-medium"
                          >
                            {language === "portugues"
                              ? t("portuguese")
                              : t("english")}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Mentor filter */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 rounded-xl py-3"
                    >
                      {selectedMentors.length === 0 ? (
                        t("mentor_placeholder")
                      ) : (
                        <div className="flex flex-wrap gap-1 items-center">
                          <Badge variant="secondary" className="text-xs">
                            {selectedMentors[0]}
                          </Badge>
                          {selectedMentors.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              +{selectedMentors.length - 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-white border-gray-200">
                    <div className="space-y-2">
                      {uniqueMentors.map((mentor) => (
                        <div
                          key={mentor}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`mentor-${mentor}`}
                            checked={selectedMentors.includes(mentor)}
                            onCheckedChange={(checked) =>
                              handleMentorChange(mentor, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`mentor-${mentor}`}
                            className="text-sm font-medium"
                          >
                            {mentor}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <div className="flex justify-start">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 rounded-xl py-3"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t("clear_filters")}
                </Button>
              </div>
            )}

            {/* Results count */}
            <div className="text-sm text-white/80 font-medium">
              {t("results_count", {
                count: filteredCourses.length,
                total: courses.length,
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
