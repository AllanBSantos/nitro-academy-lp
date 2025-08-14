"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { getCardsContent } from "@/lib/courses";
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

type MentorsGridProps = {
  locale: string;
};

type MentorItem = {
  name: string;
  country: string;
  description: string;
  courses: string[];
  image?: string;
  reviews?: { nota: number }[] | null;
};

function getFlagSrc(country?: string): string {
  const brazilFlag = "/en/brasil-flag.png";
  const usaFlag = "/en/usa-flag.png";
  const canadaFlag = "/en/canada-flag.png";
  const franceFlag = "/en/france-flag.png";
  switch ((country || "Brasil").toLowerCase()) {
    case "brasil":
      return brazilFlag;
    case "estados unidos":
      return usaFlag;
    case "canadá":
    case "canada":
      return canadaFlag;
    case "frança":
      return franceFlag;
    default:
      return brazilFlag;
  }
}

function getRatingForMentor(reviews: { nota: number }[] | null | undefined) {
  const list = reviews || [];
  const count = list.length;
  const rating =
    count > 0
      ? Number(
          (list.reduce((sum, r) => sum + (r.nota || 0), 0) / count).toFixed(1)
        )
      : 0;
  return { rating, count };
}

function renderStars(rating: number) {
  if (!rating) return null;
  const stars: JSX.Element[] = [];
  const full = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  for (let i = 0; i < full; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className="w-4 h-4 fill-[#FFD700] text-[#FFD700]"
      />
    );
  }
  if (hasHalf) {
    stars.push(
      <StarHalf key="half" className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
    );
  }
  const empty = 5 - Math.ceil(rating);
  for (let i = 0; i < empty; i++) {
    stars.push(<Star key={`e-${i}`} className="w-4 h-4 text-[#FFD700]" />);
  }
  return stars;
}

export default function MentorsGrid({ locale }: MentorsGridProps) {
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [expanded] = useState<Record<string, boolean>>({});
  const [api, setApi] = useState<CarouselApi | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<MentorItem | null>(null);

  useEffect(() => {
    async function load() {
      const courses = await getCardsContent(locale);
      const map = new Map<string, MentorItem>();
      for (const course of courses) {
        const key = course.mentor.name || "";
        if (!key) continue;
        const existing = map.get(key);
        const item: MentorItem = existing || {
          name: course.mentor.name,
          country: course.mentor.pais || "Brasil",
          description: course.mentor.descricao || "",
          courses: [],
          image: course.mentor.image,
          reviews: course.mentor.reviews || null,
        };
        if (!item.courses.includes(course.title)) {
          item.courses.push(course.title);
        }
        if (!item.reviews && course.mentor.reviews) {
          item.reviews = course.mentor.reviews;
        }
        map.set(key, item);
      }
      setMentors(Array.from(map.values()));
    }
    load();
  }, [locale]);

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
    if (api) autoplayRef.current = setInterval(() => api.scrollNext(), 5000);
  };

  const getDescription = (m: MentorItem) => {
    const isExpanded = expanded[m.name];
    const text = m.description || "";
    if (isExpanded || text.length <= 160) return text;
    return text.substring(0, 160) + "...";
  };

  // Expand control not used anymore (modal instead)

  // helpers moved to module scope

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {sortedMentors.map((m) => (
            <CarouselItem
              key={m.name}
              className="pl-2 md:pl-4 basis-[85%] md:basis-[50%] lg:basis-[33%]"
            >
              <Card className="p-6 border border-gray-200 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 truncate">
                      {m.name}
                      <Image
                        src={getFlagSrc(m.country)}
                        alt={m.country}
                        width={20}
                        height={20}
                        className="inline w-5 h-5 rounded-sm"
                      />
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const { rating, count } = getRatingForMentor(m.reviews);
                        if (count === 0) {
                          return (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                              Mentor novo
                            </span>
                          );
                        }
                        return (
                          <>
                            <span className="text-sm text-gray-700 font-medium">
                              {rating.toFixed(1)}
                            </span>
                            <div className="flex items-center">
                              {renderStars(rating)}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({count})
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                {m.description && (
                  <div className="text-gray-600 leading-relaxed mb-4">
                    {getDescription(m)}
                    {m.description.length > 160 && (
                      <button
                        className="ml-2 text-[#3B82F6] hover:underline text-sm"
                        onClick={() => {
                          setSelected(m);
                          setIsModalOpen(true);
                        }}
                      >
                        Ver mais
                      </button>
                    )}
                  </div>
                )}

                {m.courses.length > 0 && (
                  <div className="mt-auto">
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      Disciplinas:
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {m.courses.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
      <MentorsGridModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mentor={selected}
      />
    </div>
  );
}

// Modal with full mentor description
export function MentorsGridModal({
  open,
  onOpenChange,
  mentor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentor: MentorItem | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {mentor?.image ? (
              <Image
                src={mentor.image}
                alt={mentor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {mentor?.name}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              {(() => {
                const { rating, count } = getRatingForMentor(
                  mentor?.reviews || null
                );
                if (count === 0) {
                  return (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      Mentor novo
                    </span>
                  );
                }
                return (
                  <>
                    <span className="text-sm text-gray-700 font-medium">
                      {rating.toFixed(1)}
                    </span>
                    <div className="flex items-center">
                      {renderStars(rating)}
                    </div>
                    <span className="text-xs text-gray-500">({count})</span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
        <div className="mt-4 text-gray-700 leading-relaxed">
          {mentor?.description}
        </div>
        {mentor?.courses?.length ? (
          <div className="mt-4">
            <div className="text-sm font-semibold text-gray-800 mb-1">
              Disciplinas:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {mentor.courses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
