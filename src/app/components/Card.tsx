"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "./ui/button";
import { Star, StarHalf } from "lucide-react";
import { useParams } from "next/navigation";

export interface CardProps {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  mentor: {
    name: string;
    image: string;
    students: number;
    courses: number;
    profissao?: string;
    nota?: number;
    avaliacoes?: number;
    descricao?: string;
    instagram?: string;
  };
  rating: number | null;
  price: {
    installment: number;
    total: number;
    installments: number;
  };
  image: string;
  nivel?: string;
  modelo?: string;
  objetivo?: string;
  pre_requisitos?: string;
  projetos?: string;
  tarefa_de_casa?: string;
  link_pagamento?: string;
  topicosRelacionados?: string[];
  videos?: Array<{
    titulo: string;
    descricao: string;
    video: {
      url: string;
    } | null;
    video_url: string;
  }>;
  cronograma?: Array<{
    data_fim: string;
    data_inicio: string;
    dia: string;
    horario: string;
  }>;
}

export default function Card({
  slug,
  title,
  description,
  mentor,
  rating,
  image,
}: CardProps) {
  const commonT = useTranslations("common");
  const params = useParams();
  const locale = (params?.locale as string) || "pt";

  const renderStars = (rating: number) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-5 h-5 fill-white text-white" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-5 h-5 fill-white text-white" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-white" />);
    }

    return stars;
  };

  return (
    <div className="flex flex-col bg-theme-orange rounded-xl overflow-hidden h-full">
      <div className="relative h-[400px] w-full">
        {image ? (
          <>
            <Image
              src={image}
              alt={title || ""}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                console.error("Error loading image:", image);
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 flex-grow">
        <div className="flex-grow">
          <h2 className="text-2xl sm:text-3xl font-bold text-background mb-4 sm:mb-6">
            <strong>{title}</strong>
          </h2>
          <p className="text-white text-lg sm:text-xl mb-4 sm:mb-6">
            <strong>Mentor: {mentor.name}</strong>
          </p>
          <p className="text-white text-base sm:text-lg">{description}</p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 mt-auto">
          <Link href={`/${locale}/curso/${slug}`} className="block w-full">
            <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white py-3 px-6 rounded-full text-lg font-medium transition-colors duration-200">
              {commonT("more_info")}
            </Button>
          </Link>
          {rating && (
            <div className="flex items-center gap-2">
              {renderStars(rating)}
              <span className="text-white text-lg ml-2">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
