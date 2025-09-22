"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getTrailsContent } from "@/lib/courses";
import { TrailCardProps } from "@/types/card";
import TrailCard from "./TrailCard";

interface TrailGridProps {
  locale: string;
  showTitle?: boolean;
}

export default function TrailGrid({
  locale,
  showTitle = true,
}: TrailGridProps) {
  const t = useTranslations("TrailCard");
  const [trailsContent, setTrailsContent] = useState<TrailCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrails() {
      try {
        setLoading(true);
        const data = await getTrailsContent(locale);
        setTrailsContent(data);
      } catch (error) {
        console.error("Failed to load trails:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTrails();
  }, [locale]);

  if (loading) {
    return (
      <section className="w-full bg-theme-orange py-16">
        <div className="max-w-7xl mx-auto px-4">
          {showTitle && (
            <h2 className="text-3xl font-bold text-white mb-8">
              Nossas Trilhas de Aprendizado
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (trailsContent.length === 0) {
    return (
      <section className="w-full bg-theme-orange py-16">
        <div className="max-w-7xl mx-auto px-4">
          {showTitle && (
            <h2 className="text-3xl font-bold text-white mb-8">
              Nossas Trilhas de Aprendizado
            </h2>
          )}
          <div className="text-center text-white">
            <div className="bg-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                Trilhas em Desenvolvimento
              </h3>
              <p className="text-gray-700 mb-6">
                Estamos organizando nossos cursos em trilhas temáticas para uma
                experiência de aprendizado mais estruturada. Em breve você
                poderá explorar trilhas como:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-white/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">
                    🎨 Criatividade e Bem-Estar
                  </h4>
                  <p className="text-sm text-gray-700">
                    Arte, design e desenvolvimento pessoal
                  </p>
                </div>
                <div className="bg-white/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">
                    💻 Tecnologia e Programação
                  </h4>
                  <p className="text-sm text-gray-700">
                    Desenvolvimento de apps, jogos e IA
                  </p>
                </div>
                <div className="bg-white/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">
                    👥 Liderança e Negócios
                  </h4>
                  <p className="text-sm text-gray-700">
                    Empreendedorismo e habilidades de liderança
                  </p>
                </div>
                <div className="bg-white/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">
                    📱 Marketing Digital
                  </h4>
                  <p className="text-sm text-gray-700">
                    Comunicação e estratégias digitais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-theme-orange py-16">
      <div className="max-w-9xl mx-auto px-4 md:px-12">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("trails_title")}
            </h2>
            <p className="text-white text-lg max-w-3xl mx-auto">
              {t("trails_subtitle")}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trailsContent.map((trail) => (
            <TrailCard key={trail.id} {...trail} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
