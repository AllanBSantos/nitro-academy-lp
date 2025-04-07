import { notFound } from "next/navigation";
import Image from "next/image";
import { cardsContent } from "@/components/Carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import TimeSelectionSection from "@/components/TimeSelectionSection";

// This function tells Next.js which paths to pre-render
export async function generateStaticParams() {
  return cardsContent.map((course) => ({
    id: course.id,
  }));
}

const exampleCourse = {
  id: "estagiando-youtuber",
  titleKey: "Estagiando com uma YouTuber",
  description:
    "Mergulhe no universo do YouTube e aprenda como transformar suas ideias em vídeos incríveis! Descubra como planejar, gravar e editar conteúdos envolventes, além de entender estratégias para crescer no digital. No final, você publicará seu próprio vídeo sobre o uso do tempo dos adolescentes.",
  mentor: {
    name: "Beatriz Aoki",
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
    profession: "Youtuber e professora de inglês",
    description:
      "Youtuber e professora de inglês. Criadora do canal YouTuber do Zero, onde ensina como começar a criar um canal no YouTube.",
    rating: 4.5,
    reviews: 57424,
    students: 473189,
    courses: 7,
  },
  image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
  level: "Aberto a todos",
  model: "Projetos + Discussão",
  objective:
    "Desenvolver habilidades de criação de conteúdo, narrativa digital e expressão criativa por meio da produção audiovisual.",
  prerequisites:
    "Celular com câmera ou computador com acesso a ferramentas básicas de edição.",
  projects:
    "Criar roteiros, gravar vídeos curtos, experimentar técnicas de edição e lançar um vídeo final no YouTube.",
  homework:
    "Até 30 minutos semanais, como filmagens curtas e ajustes na edição.",
  relatedTopics: [
    "Ciência",
    "Inteligência Artificial",
    "Produtividade",
    "Tecnologia",
    "Educação",
    "Inovação",
  ],
};
// Cursos de exemplo
const exampleCourses = [
  {
    id: "estagiando-youtuber",
    titleKey: "Estagiando com uma YouTuber",
    mentor: {
      name: "Beatriz Aoki",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
      rating: 4.5,
      reviews: 57424,
      students: 473189,
      courses: 7,
    },
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
  },
  {
    id: "desvendando-ciencia",
    titleKey: "Desvendando a Ciência",
    mentor: {
      name: "Beatriz Aoki",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
    },
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
  },
  {
    id: "criando-podcast",
    titleKey: "Criando seu Podcast",
    mentor: {
      name: "Beatriz Aoki",
      image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
    },
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
  },
];

// No início do arquivo, após os outros dados de exemplo
const exampleReviews = [
  {
    id: 1,
    name: "Ann Marie M.",
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
    coursesCount: 66,
    reviewsCount: 5,
    rating: 5,
    timeAgo: "5 years ago",
    comment:
      "Extremely helpful and I am a little over a third of the way through. I've completed 50% and there are so many applicable actions steps I've taken and some that have solidified what I am already doing.",
  },
  {
    id: 2,
    name: "João Silva",
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
    coursesCount: 12,
    reviewsCount: 3,
    rating: 5,
    timeAgo: "2 months ago",
    comment:
      "Curso excelente! O conteúdo é muito bem estruturado e a mentora explica tudo de forma clara e objetiva. Já estou aplicando os conhecimentos no meu dia a dia.",
  },
  {
    id: 3,
    name: "Maria Santos",
    image: "https://escola.nitro.academy/wp-content/uploads/2025/03/111.webp",
    coursesCount: 34,
    reviewsCount: 8,
    rating: 4,
    timeAgo: "1 week ago",
    comment:
      "Ótimo curso para quem está começando. As dicas práticas são muito valiosas e o suporte da comunidade é incrível.",
  },
];

export default async function CourseDetails({
  params,
}: {
  params: { id: string };
}) {
  const course = cardsContent.find((course) => course.id === params.id);

  console.log(course);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-orange-600">
      {/* Primeira seção - Laranja */}
      <section className="w-full bg-orange-600 py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Video Preview */}
          <div className="mb-8">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={course.image}
                alt={course.titleKey}
                width={1280}
                height={720}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Course Title and Description */}
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2 text-background ">
              {exampleCourse.titleKey}
            </h1>
            <div className="mb-4">
              <span className="text-xl">
                Mentor: {exampleCourse.mentor.name}
              </span>
            </div>
            <p className="text-lg">{exampleCourse.description}</p>
          </div>
        </div>
      </section>

      {/* Nova seção - Carrossel de Vídeos */}
      <section className="w-full bg-[#1e1b4b] py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            Vídeos do Curso
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
                {[
                  {
                    id: 1,
                    title: "Introdução ao Curso",
                    description:
                      "Conheça os principais conceitos e objetivos deste curso incrível.",
                    videoUrl: "https://www.youtube.com/embed/ZSgwWkOB8HY",
                  },
                  {
                    id: 2,
                    title: "Primeiros Passos",
                    description:
                      "Aprenda os fundamentos básicos para começar sua jornada.",
                    videoUrl: "https://www.youtube.com/embed/ZSgwWkOB8HY",
                  },
                  {
                    id: 3,
                    title: "Dicas e Truques",
                    description:
                      "Descubra técnicas avançadas para melhorar seu desempenho.",
                    videoUrl: "https://www.youtube.com/embed/ZSgwWkOB8HY",
                  },
                ].map((video) => (
                  <CarouselItem key={video.id} className="w-full">
                    <div className="p-4">
                      <div className="bg-white rounded-xl overflow-hidden">
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={video.videoUrl}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-[#1e1b4b] mb-2">
                            {video.title}
                          </h3>
                          <p className="text-gray-600 text-lg">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
              <CarouselNext className="absolute -right-4 lg:-right-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Segunda seção - Azul */}
      <section className="w-full bg-[#3B82F6] py-16 rounded-[24px] relative z-10 -mt-[48px]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-white space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Nível</h2>
              <p className="text-lg">{exampleCourse.level}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Modelo da aula</h2>
              <p className="text-lg">{exampleCourse.model}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Objetivo</h2>
              <p className="text-lg">{exampleCourse.objective}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Pré-requisitos</h2>
              <p className="text-lg">{exampleCourse.prerequisites}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Projetos</h2>
              <p className="text-lg">{exampleCourse.projects}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Lição de Casa</h2>
              <p className="text-lg">{exampleCourse.homework}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Terceira seção - Tópicos relacionados */}
      <section className="w-full bg-[#1e1b4b] py-16 -mt-[48px]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#3B82F6] mb-8 mt-8">
            Explore tópicos relacionados
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {exampleCourse.relatedTopics.map((topic) => (
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

      {/* Quarta seção - Cursos relacionados */}
      <div className="bg-[#1e1b4b]">
        <section className="w-full bg-orange-600 py-16 rounded-[24px]">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
              Estudantes deste curso também compraram:
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
                  {cardsContent
                    .filter((c) => c.id !== params.id)
                    .map((course) => (
                      <CarouselItem
                        key={course.id}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-4">
                          <div className="rounded-2xl overflow-hidden">
                            <Image
                              src={course.image}
                              alt={course.titleKey}
                              width={400}
                              height={300}
                              className="w-full object-cover aspect-video"
                            />
                          </div>
                          <div className="mt-4">
                            <h3 className="text-2xl font-bold text-[#1e1b4b] mb-2">
                              {course.titleKey}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Mentor: {course.mentor.name}
                            </p>
                            <Link
                              href={`/curso/${course.id}`}
                              className="inline-block text-[#1e1b4b] border-2 border-[#1e1b4b] rounded-full px-6 py-2 hover:bg-[#1e1b4b] hover:text-white transition-colors duration-300"
                            >
                              + informações
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/3 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
                <CarouselNext className="absolute -right-4 lg:-right-12 top-1/3 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
              </Carousel>
            </div>
          </div>
        </section>
      </div>

      {/* Quinta seção - Dados do Mentor */}
      <section className="w-full bg-[#1e1b4b] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-white text-2xl mb-4">Mentor</h3>

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
                  {exampleCourse.mentor.profession}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#3B82F6]">★</span>
                <span className="text-xl">
                  {exampleCourse.mentor.rating} Avaliação do Instrutor
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">
                  {exampleCourse.mentor.reviews.toLocaleString()} Avaliações
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">
                  {course.mentor.students.toLocaleString()} Estudantes
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl">{course.mentor.courses} Cursos</span>
              </div>
            </div>

            <p className="text-white text-lg leading-relaxed">
              {exampleCourse.mentor.description}
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
                href="https://instagram.com/biaoki"
                target="_blank"
                className="text-white text-lg hover:text-[#3B82F6] transition-colors"
              >
                instagram.com/biaoki
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sexta seção - Outros cursos do mentor */}
      <section className="w-full bg-[#1e1b4b] ">
        <div className="w-full bg-orange-600 py-16 rounded-[24px]">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
              Outros cursos de {course.mentor.name}:
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
                  {exampleCourses
                    .filter((c) => c.id !== params.id)
                    .map((course) => (
                      <CarouselItem
                        key={course.id}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-4">
                          <div className="rounded-2xl overflow-hidden">
                            <Image
                              src={course.image}
                              alt={course.titleKey}
                              width={400}
                              height={300}
                              className="w-full object-cover aspect-video"
                            />
                          </div>
                          <div className="mt-4">
                            <h3 className="text-2xl font-bold text-[#1e1b4b] mb-2">
                              {course.titleKey}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Mentor: {course.mentor.name}
                            </p>
                            <Link
                              href={`/curso/${course.id}`}
                              className="inline-block text-[#1e1b4b] border-2 border-[#1e1b4b] rounded-full px-6 py-2 hover:bg-[#1e1b4b] hover:text-white transition-colors duration-300"
                            >
                              + informações
                            </Link>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/3 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
                <CarouselNext className="absolute -right-4 lg:-right-12 top-1/3 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Sétima seção - Avaliações do curso */}
      <section className="w-full bg-[#3B82F6] py-16 -mt-[48px]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            Avaliações do curso:
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
                {exampleReviews.map((review) => (
                  <CarouselItem
                    key={review.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="bg-white rounded-xl p-6 m-4">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={review.image}
                            alt={review.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#1e1b4b]">
                            {review.name}
                          </h3>
                          <p className="text-gray-600">
                            {review.coursesCount} cursos
                          </p>
                          <p className="text-gray-600">
                            {review.reviewsCount} avaliações
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-2xl ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-gray-600 ml-2">
                            {review.timeAgo}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{review.comment}</p>

                      <div>
                        <p className="text-gray-600 mb-4">
                          Essa avaliação foi útil?
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-colors duration-300">
                            👍
                          </button>
                          <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-colors duration-300">
                            👎
                          </button>
                          <button className="text-[#3B82F6] hover:underline ml-auto">
                            Denunciar
                          </button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-4 lg:-left-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
              <CarouselNext className="absolute -right-4 lg:-right-12 top-1/2 bg-white shadow-md hover:bg-gray-100 text-[#1e1b4b]" />
            </Carousel>
          </div>
        </div>
      </section>

      <TimeSelectionSection />
    </div>
  );
}
