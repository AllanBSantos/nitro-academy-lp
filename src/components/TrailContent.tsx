"use client";

import { useTranslations } from "next-intl";
import { TrailCardProps } from "../types/card";
import { useEffect, useState } from "react";
import Footer from "../app/components/Footer";
import TrailDescription from "./trail/TrailDescription";
import TrailInformation from "./trail/TrailInformation";
import TrailCoursesSection from "./trail/TrailCoursesSection";
import TrailSummaryCard from "./TrailSummaryCard";

interface TrailContentProps {
  trail: TrailCardProps;
}

export default function TrailContent({ trail }: TrailContentProps) {
  const t = useTranslations("TrailCard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-white text-center">{error}</div>;

  return (
    <>
      <TrailDescription trail={trail} />

      <div className="relative lg:grid lg:grid-cols-[1fr_16rem] lg:gap-8 bg-white pr-4 pt-4">
        <div>
          <TrailInformation trail={trail} />
          <TrailCoursesSection trail={trail} />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20 z-10">
            <TrailSummaryCard
              title={trail.nome}
              totalCourses={trail.totalCursos}
              description={trail.descricao}
              onExploreClick={() => {
                document
                  .getElementById("courses-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </div>

        <div className="lg:hidden">
          <TrailSummaryCard
            title={trail.nome}
            totalCourses={trail.totalCursos}
            description={trail.descricao}
            onExploreClick={() => {
              document
                .getElementById("courses-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
