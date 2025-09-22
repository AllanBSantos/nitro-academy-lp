"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import TrailGrid from "./TrailGrid";
import CarouselClient from "../app/components/CarouselClient";

interface TrailSectionToggleProps {
  locale: string;
  showTitle?: boolean;
  defaultView?: "trails" | "courses";
}

export default function TrailSectionToggle({
  locale,
  showTitle = true,
  defaultView = "trails",
}: TrailSectionToggleProps) {
  const t = useTranslations("TrailCard");
  const [currentView, setCurrentView] = useState<"trails" | "courses">(
    defaultView
  );

  return (
    <section className="w-full bg-theme-orange py-16">
      <div className="max-w-9xl mx-auto px-4 md:px-6">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 rounded-full p-1 flex">
            <button
              onClick={() => setCurrentView("trails")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentView === "trails"
                  ? "bg-white text-theme-orange shadow-lg"
                  : "text-white hover:text-white/80"
              }`}
            >
              {t("trails_title")}
            </button>
            <button
              onClick={() => setCurrentView("courses")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentView === "courses"
                  ? "bg-white text-theme-orange shadow-lg"
                  : "text-white hover:text-white/80"
              }`}
            >
              {t("courses_title")}
            </button>
          </div>
        </div>

        {/* Dynamic Title */}
        {showTitle && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {currentView === "trails"
                ? t("trails_title")
                : t("courses_title")}
            </h2>
            <p className="text-white text-lg max-w-3xl mx-auto">
              {currentView === "trails"
                ? t("trails_subtitle")
                : t("courses_subtitle")}
            </p>
          </div>
        )}

        {/* Content */}
        {currentView === "trails" ? (
          <TrailGrid locale={locale} showTitle={false} />
        ) : (
          <CarouselClient locale={locale} showTitle={false} />
        )}
      </div>
    </section>
  );
}
