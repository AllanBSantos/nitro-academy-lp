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

  console.log(">>>>>>>> 11111", cardsContent);

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
                    title={props.title}
                    description={props.description}
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

export default function Carousel({ locale }: { locale: string }) {
  const t = useTranslations("Carousel");
  return <CarouselContentWrapper locale={locale} t={t} />;
}
