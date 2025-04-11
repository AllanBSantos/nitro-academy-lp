"use client";

import {
  Carousel as CdnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Card from "@/components/Card";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCardsContent } from "@/lib/courses";

export async function CarouselContentWrapper({
  locale,
  t,
}: {
  locale: string;
  t: (key: string) => string;
}) {
  const cardsContent = await getCardsContent(locale);

  return (
    <div className="flex flex-col items-center bg-theme-orange py-8 sm:py-16">
      <section className="w-full">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-start gap-4 sm:gap-8">
            <h2 className="font-helvetica text-white text-3xl sm:text-6xl font-normal leading-tight">
              {t("choose_project")}
            </h2>
            <div className="w-full sm:w-[30vw] h-[1px] bg-white mb-6 sm:mb-12"></div>
          </div>

          <CdnCarousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-7xl"
          >
            <CarouselContent>
              {cardsContent.map((props) => (
                <CarouselItem
                  key={props.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full">
                    <Card
                      {...props}
                      title={props.title}
                      description={props.description}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </CdnCarousel>
        </div>
      </section>
      <div className="flex items-center justify-center w-full pt-8 sm:pt-14 px-4">
        <Link
          href="https://wa.me/5511975809082?text=Visitei%20o%20site%20da%20Nitro%20Academy%20e%20queria%20saber%20mais%1"
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto rounded-xl bg-background text-base sm:text-lg font-bold py-6 sm:py-8 px-6 sm:px-12 hover:bg-[#0c0c25] transition-colors duration-200">
            {t("learn_more")}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function Carousel({ locale }: { locale: string }) {
  const t = useTranslations("Carousel");
  return <CarouselContentWrapper locale={locale} t={t} />;
}
