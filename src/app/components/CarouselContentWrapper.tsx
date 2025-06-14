"use client";

import { useState, useMemo } from "react";
import { CardProps } from "@/types/card";
import CardVariant from "@/components/CardVariant";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface CarouselContentWrapperProps {
  cardsContent: CardProps[];
  learnMoreLabel: string;
  chooseProjectLabel: string;
}

export function CarouselContentWrapper({
  cardsContent,
  chooseProjectLabel,
}: CarouselContentWrapperProps) {
  const t = useTranslations("common");
  const [visibleItems, setVisibleItems] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    return cardsContent.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cardsContent, searchQuery]);

  const hasMoreItems = visibleItems < filteredCourses.length;

  const loadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 4, filteredCourses.length));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleItems(4); // Reset visible items when searching
  };

  return (
    <div className="flex flex-col items-center sm:py-8">
      <section className="w-full max-w-[1400px] mx-auto">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="flex flex-col items-start gap-4 sm:gap-8 mb-8">
            <h2 className="text-3xl font-bold text-black text-center drop-shadow mx-auto">
              {chooseProjectLabel}
            </h2>
            <div className="w-full sm:w-[30vw] h-[1px] bg-white"></div>
          </div>

          <div className="relative max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder={t("search_courses")}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-theme-orange focus:border-transparent text-black placeholder-gray-400"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {t("no_courses_found")}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCourses.slice(0, visibleItems).map((props) => (
                  <div key={props.id} className="h-full">
                    <CardVariant
                      {...props}
                      title={props.title}
                      description={props.description}
                    />
                  </div>
                ))}
              </div>

              {hasMoreItems && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMore}
                    className="bg-theme-orange hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-colors"
                  >
                    {t("load_more")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
