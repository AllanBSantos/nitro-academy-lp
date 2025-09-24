"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card } from "@/app/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";
import { Star, StarHalf } from "lucide-react";
import { TrailCardProps } from "@/types/card";

type TrailMentorsProps = {
  trail: TrailCardProps;
};

type MentorItem = {
  name: string;
  country: string;
  description: string;
  courses: string[];
  image: string;
  reviews: Array<{
    id: number;
    nota: number;
    descricao: string;
    nome: string;
    data: string;
  }> | null;
};

function renderStars(rating: number) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  for (let i = 0; i < full; i++) {
    stars.push(
      <Star key={`f-${i}`} className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
    );
  }
  if (half) {
    stars.push(
      <StarHalf key="h" className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
    );
  }
  for (let i = 0; i < empty; i++) {
    stars.push(<Star key={`e-${i}`} className="w-4 h-4 text-gray-300" />);
  }
  return stars;
}

export default function TrailMentors({ trail }: TrailMentorsProps) {
  const t = useTranslations("TrailCard");
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<MentorItem | null>(null);

  useEffect(() => {
    // Extrair mentores únicos dos cursos da trilha
    const map = new Map<string, MentorItem>();

    for (const course of trail.cursos) {
      const mentor = course.mentor;
      const key = mentor.name || "";
      if (!key) continue;

      const existing = map.get(key);
      const item: MentorItem = existing || {
        name: mentor.name,
        country: mentor.pais || "Brasil",
        description: mentor.descricao || "",
        courses: [],
        image: mentor.image,
        reviews: mentor.reviews || null,
      };

      if (!item.courses.includes(course.title)) {
        item.courses.push(course.title);
      }

      if (!item.reviews && mentor.reviews) {
        item.reviews = mentor.reviews;
      }

      map.set(key, item);
    }

    setMentors(Array.from(map.values()));
  }, [trail]);

  const sortedMentors = useMemo(
    () => [...mentors].sort((a, b) => a.name.localeCompare(b.name)),
    [mentors]
  );

  // Autoplay every 5s, pause on hover
  useEffect(() => {
    if (!api) return;
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => api.scrollNext(), 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [api]);

  const handleMouseEnter = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const handleMouseLeave = () => {
    if (api) {
      autoplayRef.current = setInterval(() => api.scrollNext(), 5000);
    }
  };

  const getDescription = (m: MentorItem) => {
    const text = m.description || "";
    if (text.length <= 160) return text;
    return text.substring(0, 160) + "...";
  };

  const getAverageRating = (reviews: Array<{ nota: number }> | null) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.nota, 0);
    return sum / reviews.length;
  };

  if (sortedMentors.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("mentors_title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("mentors_subtitle")}
          </p>
        </div>

        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {sortedMentors.map((m) => (
                <CarouselItem
                  key={m.name}
                  className="pl-2 md:pl-4 basis-[85%] md:basis-[50%] lg:basis-[33%]"
                >
                  <Card
                    className="h-full flex flex-col bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => {
                      setSelected(m);
                      setIsModalOpen(true);
                    }}
                  >
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                          <Image
                            src={m.image || "/placeholder-mentor.jpg"}
                            alt={m.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {m.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {m.country}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 flex-1">
                        {getDescription(m)}
                      </p>

                      {m.reviews && m.reviews.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1">
                            {renderStars(getAverageRating(m.reviews))}
                            <span className="text-sm text-gray-600 ml-2">
                              {getAverageRating(m.reviews).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}

                      {m.courses.length > 0 && (
                        <div className="mt-auto">
                          <div className="text-sm font-semibold text-gray-800 mb-1">
                            {t("disciplines_in_trail")}
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {m.courses.map((c) => (
                              <li key={c} className="text-sm">
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant="default"
              className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 bg-[#1e1b4b] text-white hover:bg-[#1e1b4b]/90 shadow-md"
            />
            <CarouselNext
              variant="default"
              className="absolute -right-6 md:-right-10 top-1/2 -translate-y-1/2 bg-[#1e1b4b] text-white hover:bg-[#1e1b4b]/90 shadow-md"
            />
          </Carousel>
        </div>

        <TrailMentorsModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          mentor={selected}
        />
      </div>
    </section>
  );
}

// Modal with full mentor description
export function TrailMentorsModal({
  open,
  onOpenChange,
  mentor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentor: MentorItem | null;
}) {
  const t = useTranslations("TrailCard");

  if (!mentor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
          {mentor.name}
        </DialogTitle>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={mentor.image || "/placeholder-mentor.jpg"}
                alt={mentor.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {mentor.name}
              </h3>
              <p className="text-gray-600">{mentor.country}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {t("about_mentor")}
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {mentor.description}
            </p>
          </div>

          {mentor.reviews && mentor.reviews.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t("reviews")}
              </h4>
              <div className="space-y-3">
                {mentor.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.nota)}
                      <span className="text-sm font-medium text-gray-700">
                        {review.nota.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        - {review.nome}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm italic leading-relaxed">
                      &ldquo;{review.descricao}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mentor.courses.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t("disciplines_in_trail")}
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {mentor.courses.map((course) => (
                  <li key={course} className="leading-relaxed">
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
