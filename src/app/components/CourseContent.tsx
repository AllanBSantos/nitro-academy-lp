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
import { getCardsContent } from "@/lib/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { convertToEmbedUrl } from "@/lib/utils";
import CardVariant from "@/components/CardVariant";

interface CourseContentProps {
  course: CardProps;
}

// Mock data for course content
const mockCourseContent = {
  ementaResumida: [
    "Vivência prática do empreendedorismo por meio de simulações em grupo",
    "Desenvolvimento de competências como criatividade, liderança, comunicação e resolução de problemas",
    "Estímulo ao trabalho em equipe, empatia e escuta ativa",
    "Criação e gestão de empresas simuladas, com foco em vendas, marketing e atendimento",
    "Construção de uma mentalidade empreendedora e estratégica",
    "Uso de desafios reais e dinâmicos para engajamento e superação",
    "Análise de resultados e tomada de decisões com base em indicadores",
    "Celebração do processo, aprendizados e conquistas em uma apresentação final",
  ],
  aulas: [
    {
      titulo: "Aula 1",
      descricao:
        "Formação dos grupos e início da criação das empresas simuladas, com definição de produto/serviço, nome e identidade visual",
    },
    {
      titulo: "Aula 2",
      descricao:
        "Apresentação das empresas para os colegas e definição de escopo, canais de comunicação e estratégias iniciais de operação",
    },
    {
      titulo: "Aula 3",
      descricao:
        "Desenvolvimento de habilidades de vendas, com foco em abordagem, apresentação de valor e conversão de clientes",
    },
    {
      titulo: "Aula 4",
      descricao:
        "Exploração do marketing digital com criação de perfis em redes sociais, produção de conteúdo e estratégias de engajamento",
    },
    {
      titulo: "Aula 5",
      descricao:
        "Atendimento ao cliente e pós-venda, com ênfase em escuta ativa, resolução de conflitos e fidelização",
    },
    {
      titulo: "Aula 6",
      descricao:
        "Introdução a indicadores e análise de desempenho das empresas com base em vendas, feedbacks e retenção",
    },
    {
      titulo: "Aula 7",
      descricao:
        "Criação de ações encantadoras para transformar clientes em promotores da marca e fortalecer o relacionamento",
    },
    {
      titulo: "Aula 8",
      descricao:
        "Apresentações finais com compartilhamento dos resultados, reflexões e encerramento simbólico da jornada empreendedora",
    },
  ],
};

export default function CourseContent({ course }: CourseContentProps) {
  const t = useTranslations("Course");
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const [relatedCourses, setRelatedCourses] = useState<CardProps[]>([]);
  const [isMentorImageTall, setIsMentorImageTall] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>("ementa");
  useEffect(() => {
    async function fetchRelatedCourses() {
      try {
        const courses = await getCardsContent(locale);
        const filteredCourses = courses.filter((c) => c.id !== course.id);
        setRelatedCourses(filteredCourses);
      } catch (error) {
        console.error("Error fetching related courses:", error);
      }
    }
    fetchRelatedCourses();
  }, [course.id, locale]);

  return (
    <>
      {/* seção - Descrição do curso */}
      <section className="relative bg-gradient-to-r from-[#1e1b4b] to-[#3B82F6] text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {course.title || ""}
              </h1>
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

      {/* seção - Informações do curso */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
            Informações do curso
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Short Info Cards - 2 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nível */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14v6.59L16.59 12 18 13.41l-8 8-6-6L5.41 14 11 19.59V8c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v4.17l4.59-4.59L20 9l-9 9-5-5 1.41-1.41L11 15.17V4c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2v4.17l2.59-2.59L20 7l-7 7-4-4 1.41-1.41L13 11.17V4h-2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    Nível
                  </h3>
                </div>
                <p className="text-gray-600">
                  {course.nivel || "Aberto a todos"}
                </p>
              </div>

              {/* Modelo da aula */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                    >
                      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    Modelo da aula
                  </h3>
                </div>
                <p className="text-gray-600">
                  {course.modelo || "Simulação + Projetos"}
                </p>
              </div>

              {/* Idioma */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                    >
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    Idioma
                  </h3>
                </div>
                <p className="text-gray-600">
                  {course.moeda === "Real" ? "Português do Brasil" : "English"}
                </p>
              </div>

              {/* Pré-requisitos */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                    >
                      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    Pré-requisitos
                  </h3>
                </div>
                <p className="text-gray-600">
                  {course.pre_requisitos ||
                    "Nenhum — só vontade de aprender e empreender!"}
                </p>
              </div>
            </div>

            {/* Long Info Cards - 1 per row */}
            <div className="space-y-6">
              {/* Objetivo */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14v6.59L16.59 12 18 13.41l-8 8-6-6L5.41 14 11 19.59V8c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v4.17l4.59-4.59L20 9l-9 9-5-5 1.41-1.41L11 15.17V4c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2v4.17l2.59-2.59L20 7l-7 7-4-4 1.41-1.41L13 11.17V4h-2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    Objetivo
                  </h3>
                </div>
                <p className="text-gray-600">
                  {course.objetivo ||
                    "Desenvolver habilidades práticas de empreendedorismo através de simulações e projetos reais."}
                </p>
              </div>

              {/* Projeto Final */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                    >
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    Projeto Final
                  </h3>
                </div>
                <p className="text-gray-600">
                  {course.projetos ||
                    "A turma será dividida em duas empresas fictícias que irão planejar, divulgar e vender um produto ou serviço real, aplicando estratégias de mercado para alcançar melhores resultados."}
                </p>
              </div>

              {/* Atividades Semanais */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="white"
                    >
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    Atividades Semanais
                  </h3>
                </div>
                <p className="text-gray-600">
                  {course.tarefa_de_casa ||
                    "Até 30 minutos semanais, incluindo planejamento de estratégias, pesquisas de mercado e otimização de vendas."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* seção - Conteúdo do Curso */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
            Conteúdo do curso
          </h2>

          <div className="space-y-4">
            {/* Ementa Resumida */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setActiveModule(activeModule === "ementa" ? null : "ementa")
                }
                className="w-full flex items-center justify-between p-6 bg-[#1e1b4b] text-white"
              >
                <h3 className="text-xl font-semibold">Ementa Resumida</h3>
                <span className="text-2xl">
                  {activeModule === "ementa" ? "−" : "+"}
                </span>
              </button>
              {activeModule === "ementa" && (
                <div className="p-6 bg-white">
                  <ul className="space-y-3">
                    {mockCourseContent.ementaResumida.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-[#3B82F6] text-xl">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Aulas */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setActiveModule(activeModule === "aulas" ? null : "aulas")
                }
                className="w-full flex items-center justify-between p-6 bg-[#1e1b4b] text-white"
              >
                <h3 className="text-xl font-semibold">Resumo das Aulas</h3>
                <span className="text-2xl">
                  {activeModule === "aulas" ? "−" : "+"}
                </span>
              </button>
              {activeModule === "aulas" && (
                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    {mockCourseContent.aulas.map((aula, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#3B82F6] text-white flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">📚</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#1e1b4b] mb-1">
                            {aula.titulo}
                          </h4>
                          <p className="text-gray-600">{aula.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* seção - Tópicos relacionados (tags) */}
      {course.topicosRelacionados && course.topicosRelacionados.length > 0 && (
        <section className="w-full bg-[#1e1b4b] py-16 -mt-[48px]">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#3B82F6] mb-8 mt-8">
              {t("related_topics.title")}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                {course.topicosRelacionados.map((topic: string) => (
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
      )}

      {/* seção - Dados do Mentor */}
      <section id="mentor-section" className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">Mentor</h2>

          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Mentor Image and Basic Info */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full overflow-hidden">
                  <Image
                    src={course.mentor.image}
                    alt={course.mentor.name}
                    width={160}
                    height={160}
                    className={`w-full h-full object-cover ${
                      isMentorImageTall ? "object-top" : "object-center"
                    }`}
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      const aspectRatio = naturalHeight / naturalWidth;
                      setIsMentorImageTall(aspectRatio > 1.5);
                    }}
                  />
                </div>
                {course.mentor.instagram && (
                  <div className="mt-4 flex items-center justify-center">
                    <Link
                      href={course.mentor.instagram}
                      target="_blank"
                      className="text-[#3B82F6] hover:text-[#1e1b4b] transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>{course.mentor.instagram_label}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mentor Details */}
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#1e1b4b] mb-2">
                    {course.mentor.name}
                  </h3>
                  {course.mentor.profissao && (
                    <p className="text-gray-600 italic">
                      {course.mentor.profissao}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {course.mentor.nota !== undefined &&
                    course.mentor.nota > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#3B82F6] text-xl">★</span>
                        <div>
                          <p className="text-sm text-gray-600">Avaliação</p>
                          <p className="font-semibold text-[#1e1b4b]">
                            {course.mentor.nota}
                          </p>
                        </div>
                      </div>
                    )}
                  {course.mentor.avaliacoes !== undefined &&
                    course.mentor.avaliacoes > 0 && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[#3B82F6]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600">Avaliações</p>
                          <p className="font-semibold text-[#1e1b4b]">
                            {course.mentor.avaliacoes.toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    )}
                  {course.mentor.students > 0 && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#3B82F6]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Alunos</p>
                        <p className="font-semibold text-[#1e1b4b]">
                          {course.mentor.students.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}
                  {course.mentor.courses > 0 && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#3B82F6]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Cursos</p>
                        <p className="font-semibold text-[#1e1b4b]">
                          {course.mentor.courses}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {course.mentor.descricao || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* seção - Seleção de horários */}
      <TimeSelectionSection course={course} />

      {/* seção - Cursos relacionados */}
      {relatedCourses.length > 0 && (
        <div className="bg-[#1e1b4b]">
          <section className="w-full bg-gray-50 py-16 rounded-[24px] rounded-t-none">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
                {t("you_may_also_like")}
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
                    {relatedCourses.map((relatedCourse) => (
                      <CarouselItem
                        key={relatedCourse.id}
                        className="pl-2 md:pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]"
                      >
                        <CardVariant
                          {...relatedCourse}
                          title={relatedCourse.title}
                          description={relatedCourse.description}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
                  <CarouselNext className="absolute -right-4 lg:-right-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
                </Carousel>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* seção - Footer */}
      <section className="bg-background">
        <Footer />
      </section>
    </>
  );
}
