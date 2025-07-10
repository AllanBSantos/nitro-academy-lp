"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CardProps } from "@/types/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface CourseFiltersProps {
  courses: CardProps[];
  onFilterChange: (filteredCourses: CardProps[]) => void;
}

export default function CourseFilters({
  courses,
  onFilterChange,
}: CourseFiltersProps) {
  const t = useTranslations("CourseFilters");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedMentor, setSelectedMentor] = useState("all");

  // Get unique values for filters
  const uniqueDays = useMemo(() => {
    const days = new Set<string>();
    courses.forEach((course) => {
      course.cronograma?.forEach((schedule) => {
        days.add(schedule.dia);
      });
    });
    return Array.from(days).sort();
  }, [courses]);

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
        selectedDay === "all" ||
        course.cronograma?.some((schedule) => schedule.dia === selectedDay);

      // Filter by language
      const matchesLanguage =
        selectedLanguage === "all" || course.lingua === selectedLanguage;

      // Filter by mentor
      const matchesMentor =
        selectedMentor === "all" || course.mentor?.name === selectedMentor;

      return matchesSearch && matchesDay && matchesLanguage && matchesMentor;
    });
  }, [courses, searchTerm, selectedDay, selectedLanguage, selectedMentor]);

  // Update parent component when filters change
  useMemo(() => {
    onFilterChange(filteredCourses);
  }, [filteredCourses, onFilterChange]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDay("all");
    setSelectedLanguage("all");
    setSelectedMentor("all");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedDay !== "all" ||
    selectedLanguage !== "all" ||
    selectedMentor !== "all";

  return (
    <div className="w-full mb-8">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search by name */}
          <div className="flex-1">
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
          <div className="lg:w-48">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 transition-all duration-200 rounded-xl py-3">
                <SelectValue placeholder={t("day_placeholder")} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">{t("all_days")}</SelectItem>
                {uniqueDays.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language filter */}
          <div className="lg:w-48">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 transition-all duration-200 rounded-xl py-3">
                <SelectValue placeholder={t("language_placeholder")} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">{t("all_languages")}</SelectItem>
                {uniqueLanguages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language === "portugues" ? t("portuguese") : t("english")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mentor filter */}
          <div className="lg:w-48">
            <Select value={selectedMentor} onValueChange={setSelectedMentor}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 transition-all duration-200 rounded-xl py-3">
                <SelectValue placeholder={t("mentor_placeholder")} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">{t("all_mentors")}</SelectItem>
                {uniqueMentors.map((mentor) => (
                  <SelectItem key={mentor} value={mentor}>
                    {mentor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <div className="lg:w-auto">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full lg:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 rounded-xl py-3"
              >
                <X className="w-4 h-4 mr-2" />
                {t("clear_filters")}
              </Button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mt-6 text-sm text-white/80 font-medium">
          {t("results_count", {
            count: filteredCourses.length,
            total: courses.length,
          })}
        </div>
      </div>
    </div>
  );
}
