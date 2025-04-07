import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "./ui/button";
import { Star, StarHalf } from "lucide-react";

export interface CardProps {
  id: string;
  title?: string;
  description?: string;
  titleKey: string;
  descriptionKey: string;
  mentor: {
    name: string;
    image: string;
    students: number;
    courses: number;
  };
  rating: number;
  price: {
    installment: number;
    total: number;
  };
  image: string;
}

export default function Card({
  id,
  title,
  description,
  titleKey,
  descriptionKey,
  mentor,
  rating = 0,
  image,
}: CardProps) {
  const t = useTranslations("Carousel");

  const renderStars = (rating: number) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Adiciona estrelas cheias
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-5 h-5 fill-white text-white" />
      );
    }

    // Adiciona meia estrela se necessário
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-5 h-5 fill-white text-white" />
      );
    }

    // Adiciona estrelas vazias
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-white" />);
    }

    return stars;
  };

  return (
    <div className="flex flex-col bg-theme-orange rounded-xl overflow-hidden h-[720px]">
      <div className="relative h-72 w-full shrink-0">
        <Image
          src={image}
          alt={title || t(titleKey)}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="p-6 flex flex-col h-full justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-background">
            <strong>{title || t(titleKey)}</strong>
          </h2>
          <p className="text-white">
            <strong>Mentor: {mentor.name}</strong>
          </p>
          <p className="text-white line-clamp-8">
            {description || t(descriptionKey)}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href={`/curso/${id}`}>
            <Button className="w-1/2 bg-transparent hover:bg-white/10 text-white border border-white py-2 px-4 rounded-full font-normal">
              + informações
            </Button>
          </Link>
          <div className="flex items-center gap-1">
            {rating > 0 && renderStars(rating)}
            <span className="text-white ml-2">
              {rating > 0 ? rating.toFixed(1) : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
