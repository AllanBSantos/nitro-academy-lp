"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Review {
  id: number;
  key: string;
  image?: string;
}

export default function Reviews() {
  const t = useTranslations("Reviews");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reviews: Review[] = [
    {
      id: 1,
      key: "cecilia",
      image: `/pt/cecilia.jpg`,
    },
    {
      id: 2,
      key: "giovana",
      image: `/pt/giovana.jpg`,
    },
    {
      id: 3,
      key: "alessandra",
      image: `/pt/alessandra.jpg`,
    },
    {
      id: 4,
      key: "valdecir",
      image: `/pt/valdecir.jpg`,
    },
    {
      id: 5,
      key: "alice",
      image: `/pt/Alice.jpg`,
    },
    {
      id: 6,
      key: "ana",
      image: `/pt/Ana.png`,
    },
    {
      id: 7,
      key: "anne",
      image: `/pt/Anne.png`,
    },
    {
      id: 8,
      key: "gabrielle",
      image: `/pt/Gabrielle.png`,
    },
    {
      id: 9,
      key: "julia",
      image: `/pt/Julia.png`,
    },
    {
      id: 10,
      key: "leonardo",
      image: `/pt/Leonardo.png`,
    },
    {
      id: 11,
      key: "marina",
      image: `/pt/Marina.png`,
    },
    {
      id: 12,
      key: "miguel",
      image: `/pt/Miguel.png`,
    },
    {
      id: 13,
      key: "karina",
    },
    {
      id: 14,
      key: "livia",
    },
    {
      id: 15,
      key: "waldemar",
    },
    {
      id: 16,
      key: "claudiana",
    },
    {
      id: 17,
      key: "ricardo",
    },
    {
      id: 18,
      key: "jamila",
    },
  ];

  const reviewsSorted = [...reviews].reverse();

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

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
              {reviewsSorted.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-2 md:pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]"
                >
                  <div
                    className={`bg-white rounded-xl p-6 shadow-lg h-80 transition-shadow duration-200 ${
                      t(`reviews.${review.key}.comment`).length > 120
                        ? "cursor-pointer hover:shadow-xl"
                        : ""
                    }`}
                    onClick={() => {
                      if (t(`reviews.${review.key}.comment`).length > 120) {
                        handleReviewClick(review);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center text-center h-full">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-gray-200 flex items-center justify-center">
                        {renderAvatar(review)}
                      </div>
                      <span className="font-semibold text-gray-800 mb-2">
                        {t(`reviews.${review.key}.name`)} -{" "}
                        {t(`reviews.${review.key}.description`)}
                      </span>
                      <p className="text-gray-600 mb-4 flex-1">
                        {truncateText(t(`reviews.${review.key}.comment`))}
                      </p>
                      {t(`reviews.${review.key}.comment`).length > 120 && (
                        <div className="text-orange-600 text-sm font-medium">
                          {t("click_to_see_more")}
                        </div>
                      )}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-white border-gray-200 [&>button]:text-gray-800 [&>button]:hover:text-gray-600 [&>button]:hover:bg-gray-100">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedReview && (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {selectedReview.image ? (
                        <Image
                          src={selectedReview.image}
                          alt={t(`reviews.${selectedReview.key}.name`)}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-600 text-white text-xl font-bold">
                          {getInitials(t(`reviews.${selectedReview.key}.name`))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {t(`reviews.${selectedReview.key}.name`)} -{" "}
                    {t(`reviews.${selectedReview.key}.description`)}
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="text-gray-600 text-center">
            {selectedReview && t(`reviews.${selectedReview.key}.comment`)}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
