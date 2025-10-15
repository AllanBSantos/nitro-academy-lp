"use client";

import { Palette, Code, Briefcase, Users, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fetchTrilhasWithCourseCount, TrilhaWithCount } from "@/lib/strapi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type TrackKey = "creativity" | "technology" | "business" | "leadership";

type TrackWithMeta = TrilhaWithCount & {
  trackKey?: TrackKey;
};

const trackStyles: Record<TrackKey, { icon: typeof Palette; color: string }> = {
  creativity: { icon: Palette, color: "#f54a12" },
  technology: { icon: Code, color: "#599fe9" },
  business: { icon: Briefcase, color: "#3B82F6" },
  leadership: { icon: Users, color: "#03A9F4" },
};

const normalizeTrackName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-–]/g, " ")
    .trim();

const trackNameMap: Record<string, TrackKey> = {
  "criatividade e bem estar": "creativity",
  "criatividade e bem-estar": "creativity",
  "creativity and well being": "creativity",
  "creativity and well-being": "creativity",
  tecnologia: "technology",
  technology: "technology",
  negocios: "business",
  negócios: "business",
  "business and entrepreneurship": "business",
  business: "business",
  lideranca: "leadership",
  liderança: "leadership",
  leadership: "leadership",
};

const resolveTrackKey = (name: string): TrackKey | undefined => {
  const normalized = normalizeTrackName(name);
  return trackNameMap[normalized];
};

export function Program() {
  const t = useTranslations("NewHome.Program");
  const [tracks, setTracks] = useState<TrackWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackTracks = useMemo(() => {
    const rawFallback = t.raw("fallbackTracks") as {
      id: number;
      key: TrackKey;
      courseCount: number;
    }[];

    return rawFallback.map(
      (track) =>
        ({
          id: track.id,
          nome: t(`tracks.${track.key}.name`),
          descricao: t(`tracks.${track.key}.description`),
          courseCount: track.courseCount,
          trackKey: track.key,
        } satisfies TrackWithMeta)
    );
  }, [t]);

  const translateTrack = useCallback(
    (track: TrilhaWithCount): TrackWithMeta => {
      const trackKey = resolveTrackKey(track.nome);
      if (trackKey) {
        return {
          ...track,
          nome: t(`tracks.${trackKey}.name`),
          descricao: t(`tracks.${trackKey}.description`),
          trackKey,
        };
      }

      return { ...track };
    },
    [t]
  );

  useEffect(() => {
    const loadTrilhas = async () => {
      try {
        const trilhasData = await fetchTrilhasWithCourseCount();
        if (trilhasData.length === 0) {
          setTracks(fallbackTracks);
          return;
        }
        setTracks(trilhasData.map(translateTrack));
      } catch (error) {
        console.error("Error loading trilhas:", error);
        setTracks(fallbackTracks);
      } finally {
        setLoading(false);
      }
    };

    loadTrilhas();
  }, [fallbackTracks, translateTrack]);

  // Mapear ícones e cores para cada trilha
  const getTrackConfig = (track: TrackWithMeta) => {
    const key = track.trackKey ?? resolveTrackKey(track.nome) ?? "creativity";
    return trackStyles[key];
  };

  return (
    <section
      id="programa"
      className="py-12 md:py-20 bg-gradient-to-br from-[#19184b] via-[#1e1b4b] to-[#19184b] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 border-2 border-[#599fe9] rounded-full"></div>
        <div className="absolute bottom-2 md:bottom-10 left-10 w-48 h-48 border-2 border-[#f54a12] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl text-[#f9f9fa]">
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-[#f54a12]">{chunks}</span>
              ),
            })}
          </h2>
          <p className="text-lg md:text-xl text-[#f9f9fa]/80 max-w-3xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-8 md:mb-16">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f54a12]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {tracks.map((item, index) => {
                const config = getTrackConfig(item);
                const Icon = config.icon;
                return (
                  <motion.div
                    key={item.id}
                    className="relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 flex flex-col h-full"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                        style={{ backgroundColor: config.color }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center space-y-2 flex-grow">
                        <h3 className="text-xl text-[#f9f9fa]">{item.nome}</h3>
                        <p className="text-[#f9f9fa]/70">{item.descricao}</p>
                        <div className="pt-2">
                          <span className="text-[#f9f9fa]/60 text-sm">
                            {t("courseCount", { count: item.courseCount })}
                          </span>
                        </div>
                      </div>
                      <button
                        className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2.5 text-[#f9f9fa] transition-all duration-300 flex items-center justify-center gap-2 group"
                        style={{
                          borderColor: config.color + "40",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            config.color + "20";
                          e.currentTarget.style.borderColor = config.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255, 255, 255, 0.1)";
                          e.currentTarget.style.borderColor =
                            config.color + "40";
                        }}
                      >
                        {t("exploreTrack")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
