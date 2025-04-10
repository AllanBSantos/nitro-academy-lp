"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import TimeSelectionSection from "@/components/TimeSelectionSection";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { CardProps } from "./Card";

interface CourseContentProps {
  course: CardProps;
}

export default function CourseContent({ course }: CourseContentProps) {
  const t = useTranslations("Course");

  return (
    <>
      {/* seção - Descrição do curso */}
      <section className="w-full bg-orange-600 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={course.image}
                alt={course.title || course.titleKey}
                width={1280}
                height={720}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2 text-background">
              {course.title || course.titleKey}
            </h1>
            <div className="mb-4">
              <span className="text-xl">
                {t("mentor.label")}: {course.mentor.name}
              </span>
            </div>
            <p className="text-lg">
              {course.description || course.descriptionKey}
            </p>
          </div>
        </div>
      </section>

      {/* seção - Carrossel de Vídeos */}
      <section className="w-full bg-[#1e1b4b] py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            {t("understand_more")}
          </h2>

          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {(course.videos || []).map(
                  (video: {
                    titulo: string;
                    descricao: string;
                    video: { url: string } | null;
                    video_url: string;
                  }) => (
                    <CarouselItem key={video.titulo} className="w-full">
                      <div className="p-4">
                        <div className="bg-white rounded-xl overflow-hidden">
                          <div className="aspect-video">
                            <iframe
                              width="100%"
                              height="100%"
                              src={video.video_url}
                              title={video.titulo}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                          <div className="p-6">
                            <h3 className="text-2xl font-bold text-[#1e1b4b] mb-2">
                              {video.titulo}
                            </h3>
                            <p className="text-gray-600 text-lg">
                              {video.descricao}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
              <CarouselNext className="absolute -right-4 lg:-right-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* seção - Informações do curso */}
      <section className="w-full bg-[#3B82F6] py-16 rounded-[24px] relative z-10 -mt-[48px]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-white space-y-8">
            {course.nivel && (
              <div>
                <h2 className="text-2xl font-bold mb-2">{t("level.label")}</h2>
                <p className="text-lg">{course.nivel}</p>
              </div>
            )}

            {course.modelo && (
              <div>
                <h2 className="text-2xl font-bold mb-2">{t("model.label")}</h2>
                <p className="text-lg">{course.modelo}</p>
              </div>
            )}

            {course.objetivo && (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t("objective.label")}
                </h2>
                <p className="text-lg">{course.objetivo}</p>
              </div>
            )}

            {course.pre_requisitos && (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t("prerequisites.label")}
                </h2>
                <p className="text-lg">{course.pre_requisitos}</p>
              </div>
            )}

            {course.projetos && (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t("projects.label")}
                </h2>
                <p className="text-lg">{course.projetos}</p>
              </div>
            )}

            {course.tarefa_de_casa && (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t("homework.label")}
                </h2>
                <p className="text-lg">{course.tarefa_de_casa}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* seção - Tópicos relacionados (tags) */}
      <section className="w-full bg-[#1e1b4b] py-16 -mt-[48px]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#3B82F6] mb-8 mt-8">
            {t("related_topics.title")}
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {(course.topicosRelacionados || []).map((topic: string) => (
                <button
                  key={topic}
                  className="px-6 py-3 rounded-full border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-colors duration-300"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* seção - Dados do Mentor */}
      <section className="w-full bg-[#1e1b4b] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-white text-2xl mb-4">{t("mentor.label")}</h3>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={course.mentor.image}
                  alt={course.mentor.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  {course.mentor.name}
                </h2>
                <p className="text-gray-300 text-xl italic">
                  {course.mentor.profissao || t("mentor.label")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#3B82F6]">★</span>
                <span className="text-xl">
                  {course.mentor.nota || 0} {t("mentor.rating_label")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">
                  {course.mentor.avaliacoes || 0} {t("mentor.reviews_label")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">
                  {course.mentor.students.toLocaleString()}{" "}
                  {t("mentor.students_label")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">
                  {course.mentor.courses} {t("mentor.courses_label")}
                </span>
              </div>
            </div>

            <p className="text-white text-lg leading-relaxed">
              {course.mentor.descricao || "Mentor experiente na área."}
            </p>

            <div className="flex items-center gap-2 mt-4">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <Link
                href={course.mentor.instagram || "#"}
                target="_blank"
                className="text-white text-lg hover:text-[#3B82F6] transition-colors"
              >
                {course.mentor.instagram || "instagram.com/mentor"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* seção - Seleção de horários */}
      <TimeSelectionSection />

      {/* seção - Footer */}
      <section className="bg-background">
        <Footer />
      </section>
    </>
  );
}
