import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { convertToEmbedUrl } from "@/lib/utils";
import { CardProps } from "@/types/card";

interface CourseDescriptionProps {
  course: CardProps;
}

export default function CourseDescription({ course }: CourseDescriptionProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#1e1b4b] to-[#3B82F6] text-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {course.title || ""}
            </h1>
            {course.mentor && course.mentor.name && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    document
                      .getElementById("mentor-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={course.mentor.image}
                      alt={course.mentor.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xl font-medium">
                      {course.mentor.name}
                    </span>
                  </div>
                </button>
              </div>
            )}
            <p className="text-lg md:text-xl opacity-90 mb-8 whitespace-pre-line">
              {course.description || ""}
            </p>
          </div>

          {course.videos && course.videos.length > 0 && (
            <div className="w-full lg:w-[500px]">
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
                <CarouselContent>
                  {course.videos.map((video, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-white rounded-xl overflow-hidden">
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={convertToEmbedUrl(video.video_url)}
                            title={video.titulo}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-[#1e1b4b] mb-2">
                            {video.titulo}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {video.descricao}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
                <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
              </Carousel>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
