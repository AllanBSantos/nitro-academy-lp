import {
  Carousel as CdnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Card, { CardProps } from "@/components/Card";
import CardVariant from "@/components/CardVariant";

interface CarouselContentWrapperProps {
  cardsContent: CardProps[];
  learnMoreLabel: string;
  chooseProjectLabel: string;
}

export function CarouselContentWrapper({
  cardsContent,
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
                align: "start",
                loop: true,
                containScroll: "trimSnaps",
                dragFree: true,
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {cardsContent.map((props) => (
                  <CarouselItem
                    key={props.id}
                    className="pl-2 md:pl-4 basis-[95%] md:basis-[48%] lg:basis-[32%]"
                  >
                    <div className="h-full">
                      <CardVariant
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
    </div>
  );
}
