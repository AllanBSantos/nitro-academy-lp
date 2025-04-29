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
import CategoryModal from "./CategoryModal";

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
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    description: string;
  } | null>(null);

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

  const formatDescription = (text: string) => {
    if (!text) return "";

    const paragraphs = text.split("\n");

    return paragraphs.map((paragraph, index) => {
      if (paragraph.trim().startsWith("*")) {
        return (
          <li key={index} className="ml-4">
            {paragraph.trim().substring(1).trim()}
          </li>
        );
      }
      return <p key={index}>{paragraph}</p>;
    });
  };

  const getPreviewDescription = (text: string) => {
    if (!text) return "";
    const paragraphs = text.split("\n");
    return paragraphs[0];
  };

  const categories = [
    {
      title: "Nível",
      description: course.nivel || "Aberto a todos",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Pré-requisitos",
      description:
        course.pre_requisitos?.replace(/\\n/g, "\n") ||
        "Nenhum — só vontade de aprender!",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Competências Desenvolvidas",
      description:
        course.competencias?.replace(/\\n/g, "\n") ||
        "Criatividade, pensamento crítico, resolução de problemas",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Projeto Final",
      description:
        course.projetos?.replace(/\\n/g, "\n") ||
        "Projeto prático aplicando os conhecimentos adquiridos",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      title: "Modelo da Aula",
      description:
        course.modelo?.replace(/\\n/g, "\n") ||
        "Aulas online ao vivo com atividades práticas",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Atividades Semanais",
      description:
        course.tarefa_de_casa?.replace(/\\n/g, "\n") ||
        "Projetos práticos para fixação do conteúdo",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Ideal para jovens que...",
      description:
        course.ideal_para?.replace(/\\n/g, "\n") ||
        "Querem desenvolver habilidades práticas e criativas",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.title}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:border-[#3B82F6] transition-colors duration-300 text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e1b4b]">
                    {category.title}
                  </h3>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  {getPreviewDescription(category.description)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <CategoryModal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title={selectedCategory?.title || ""}
        description={
          <div className="space-y-4">
            {formatDescription(selectedCategory?.description || "")}
          </div>
        }
      />

      {/* seção - Conteúdo do Curso */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
            Conteúdo do curso
          </h2>

          <div className="space-y-4">
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
