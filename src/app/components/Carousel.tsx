import {
  Carousel as CdnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Card, { CardProps } from "@/components/Card";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const cardsContent: CardProps[] = [
  {
    id: "estagiando-youtuber",
    titleKey: "youtuber_title",
    descriptionKey: "youtuber_desc",
    mentor: {
      name: "Beatriz Aoki",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
      students: 47000,
      courses: 7,
    },
    rating: 4.8,
    price: {
      installment: 33.33,
      total: 99.99,
    },
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
  },
  {
    id: "explorando-ciencia",
    titleKey: "science_title",
    descriptionKey: "science_desc",
    mentor: {
      name: "Maria Silva",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
      students: 35000,
      courses: 5,
    },
    rating: 4.7,
    price: {
      installment: 33.33,
      total: 99.99,
    },
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/222.webp",
  },
  {
    id: "escrevendo-livro",
    titleKey: "book_title",
    descriptionKey: "book_desc",
    mentor: {
      name: "Ana Costa",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
      students: 28000,
      courses: 4,
    },
    rating: 4.9,
    price: {
      installment: 33.33,
      total: 99.99,
    },
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/3-2.webp",
  },
  {
    id: "empreendedorismo",
    titleKey: "entrepreneurship_title",
    descriptionKey: "entrepreneurship_desc",
    mentor: {
      name: "João Silva",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
      students: 32000,
      courses: 6,
    },
    rating: 4.6,
    price: {
      installment: 33.33,
      total: 99.99,
    },
    image:
      "https://escola.nitro.academy/wp-content/uploads/2025/03/4-Descobrindo-o-Mundo-do-Empreendedorismo_-1.webp",
  },
  {
    id: "english-quizzes",
    titleKey: "english_title",
    descriptionKey: "english_desc",
    mentor: {
      name: "Sarah Johnson",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
      students: 41000,
      courses: 8,
    },
    rating: 4.9,
    price: {
      installment: 33.33,
      total: 99.99,
    },
    image:
      "https://escola.nitro.academy/wp-content/uploads/2025/03/mask_group.webp",
  },
  {
    id: "mercado-imobiliario",
    titleKey: "realestate_title",
    descriptionKey: "realestate_desc",
    mentor: {
      name: "Carlos Santos",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
      students: 25000,
      courses: 4,
    },
    rating: 4.7,
    price: {
      installment: 33.33,
      total: 99.99,
    },
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/6-1.webp",
  },
];

export default function Carousel() {
  const t = useTranslations("Carousel");

  return (
    <div className="flex flex-col items-center bg-theme-orange py-16">
      <section>
        <div className="container">
          <div className="flex flex-col items-start gap-8">
            <h2 className=" font-helvetica  text-white text-6xl font-normal leading-tight">
              Escolha seu
              <br />
              projeto
            </h2>
            <div className="w-[30vw] h-[1px] bg-white mb-12"></div>
          </div>

          <CdnCarousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-7xl px-4"
          >
            <CarouselContent className="-ml-4">
              {cardsContent.map((props) => (
                <CarouselItem
                  key={props.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card
                    {...props}
                    title={t(props.titleKey)}
                    description={t(props.descriptionKey)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </CdnCarousel>
        </div>
      </section>
      <div className="flex items-center justify-center w-full pt-14">
        <Link href="https://wa.me/5511975809082?text=Visitei%20o%20site%20da%20Nitro%20Academy%20e%20queria%20saber%20mais%1">
          <Button className="rounded-xl bg-background text-lg font-bold py-8 px-12 hover:bg-[#0c0c25] transition-colors duration-200">
            {t("learn_more")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
