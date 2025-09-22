"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import TrailContent from "./TrailContent";
import { getTrailsContent } from "../lib/courses";
import { TrailCardProps } from "../types/card";

export default function TrailContentClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "pt-BR";
  const slug = params?.slug as string;

  const [trail, setTrail] = useState<TrailCardProps | null>(null);
  const [loading, setLoading] = useState(true);

  const t = useTranslations("common");

  useEffect(() => {
    async function fetchTrail() {
      try {
        const trails = await getTrailsContent(locale);
        const found = trails.find((t) => {
          // Normalizar o nome da trilha para comparar com o slug
          const normalizedName = t.nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          return normalizedName === slug;
        });
        setTrail(found || null);
      } catch (error) {
        console.error("Error fetching trail:", error);
        setTrail(null);
      } finally {
        setLoading(false);
      }
    }

    fetchTrail();
  }, [locale, slug]);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (!trail) return <p className="text-white text-center">{t("not_found")}</p>;

  return <TrailContent trail={trail} />;
}
