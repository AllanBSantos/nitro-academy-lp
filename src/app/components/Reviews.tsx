"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Review {
  id: number;
  key: string;
  image?: string;
}

interface ReviewsProps {
  locale: string;
}

export default function Reviews({ locale }: ReviewsProps) {
  const t = useTranslations("Reviews");

  const reviews: Review[] = [
    {
      id: 1,
      key: "cecilia",
      image: `/${locale}/cecilia.jpg`,
    },
    {
      id: 2,
      key: "giovana",
      image: `/${locale}/giovana.jpg`,
    },
    {
      id: 3,
      key: "alessandra",
      image: `/${locale}/alessandra.jpg`,
    },
    {
      id: 4,
      key: "valdecir",
      image: `/${locale}/valdecir.jpg`,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const renderAvatar = (review: Review) => {
    if (review.image) {
      return (
        <Image
          src={review.image}
          alt={t(`reviews.${review.key}.name`)}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-orange-600 text-white text-2xl font-bold">
        {getInitials(t(`reviews.${review.key}.name`))}
      </div>
    );
  };

  return (
    <section className="w-full bg-[#1e1b4b] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {t("title")}
        </h2>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps",
              dragFree: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {reviews.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-2 md:pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]"
                >
                  <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-gray-200 flex items-center justify-center">
                        {renderAvatar(review)}
                      </div>
                      <span className="font-semibold text-gray-800 mb-2">
                        {t(`reviews.${review.key}.name`)} -{" "}
                        {t(`reviews.${review.key}.description`)}
                      </span>
                      <p className="text-gray-600 mb-4">
                        {t(`reviews.${review.key}.comment`)}
                      </p>
                      <div className="flex flex-col items-center"></div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
            <CarouselNext className="absolute -right-4 lg:-right-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
