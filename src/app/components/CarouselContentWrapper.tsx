import {
  Carousel as CdnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Card, { CardProps } from "@/components/Card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CarouselContentWrapperProps {
  cardsContent: CardProps[];
  learnMoreLabel: string;
  chooseProjectLabel: string;
}

export function CarouselContentWrapper({
  cardsContent,
  learnMoreLabel,
  chooseProjectLabel,
}: CarouselContentWrapperProps) {
  return (
    <div className="flex flex-col items-center bg-theme-orange py-8 sm:py-16">
      <section className="w-full max-w-[1400px] mx-auto">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="flex flex-col items-start gap-4 sm:gap-8 mb-8">
            <h2 className="font-helvetica text-white text-3xl sm:text-6xl font-normal leading-tight">
              {chooseProjectLabel}
            </h2>
            <div className="w-full sm:w-[30vw] h-[1px] bg-white"></div>
          </div>

          <div className="relative w-full">
            <CdnCarousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {cardsContent.map((props) => (
                  <CarouselItem
                    key={props.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 h-[1100px]"
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
                <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
              </div>
            </CdnCarousel>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-center w-full max-w-[1400px] pt-8 sm:pt-14 px-4">
        <Link
          href="https://wa.me/5511975809082?text=Visitei%20o%20site%20da%20Nitro%20Academy%20e%20queria%20saber%20mais%1"
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto rounded-xl bg-background text-base sm:text-lg font-bold py-6 sm:py-8 px-6 sm:px-12 hover:bg-[#0c0c25] transition-colors duration-200">
            {learnMoreLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
