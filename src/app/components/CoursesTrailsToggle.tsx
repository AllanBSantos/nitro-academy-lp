"use client";

import { useState } from "react";
import PlanCarousel from "./PlanCarousel";
import TrailGrid from "../../components/TrailGrid";

interface CoursesTrailsToggleProps {
  locale: string;
}

export default function CoursesTrailsToggle({
  locale,
}: CoursesTrailsToggleProps) {
  const [currentView, setCurrentView] = useState<"trails" | "courses">(
    "courses"
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
              Trilhas
            </button>
            <button
              onClick={() => setCurrentView("courses")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentView === "courses"
                  ? "bg-white text-theme-orange shadow-lg"
                  : "text-white hover:text-white/80"
              }`}
            >
              Cursos
            </button>
          </div>
        </div>

        {/* Dynamic Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {currentView === "trails" ? "Nossas Trilhas" : "Nossos Cursos"}
          </h2>
          <p className="text-white text-lg max-w-3xl mx-auto">
            {currentView === "trails"
              ? "Explore trilhas completas de aprendizado organizadas por área de conhecimento"
              : "Escolha o plano que melhor se adapta às suas necessidades e descubra cursos incríveis para desenvolver seus adolescentes"}
          </p>
        </div>

        {/* Content */}
        {currentView === "trails" ? (
          <TrailGrid locale={locale} showTitle={false} />
        ) : (
          <>
            {/* Gold Plan Courses */}
            <PlanCarousel locale={locale} planType="gold" />

            {/* Black Plan Courses */}
            <PlanCarousel locale={locale} planType="black" />
          </>
        )}
      </div>
    </section>
  );
}
