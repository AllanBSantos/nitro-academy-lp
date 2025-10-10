import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { fetchAllMentors } from "@/lib/strapi";
import { Mentor, StrapiImage } from "@/types/strapi";

export function Mentors() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar mentores do Strapi
  useEffect(() => {
    const loadMentors = async () => {
      try {
        const mentorsData = await fetchAllMentors("pt-BR");
        setMentors(mentorsData);
      } catch (error) {
        console.error("Error loading mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, []);

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1); // Mobile: 1 card
      } else {
        setItemsPerPage(3); // Desktop: 3 cards
      }
    };

    // Executar na montagem
    handleResize();

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Função para calcular rating médio
  const calculateRating = (reviews: Mentor["reviews"]) => {
    if (!reviews || reviews.length === 0) return { rating: 0, count: 0 };

    const totalRating = reviews.reduce((sum, review) => sum + review.nota, 0);
    const averageRating = totalRating / reviews.length;

    return {
      rating: parseFloat(averageRating.toFixed(1)),
      count: reviews.length,
    };
  };

  // Função para obter bandeira do país
  const getCountryFlag = (country?: string) => {
    switch (country?.toLowerCase()) {
      case "brasil":
        return "🇧🇷";
      case "estados unidos":
      case "usa":
        return "🇺🇸";
      case "canadá":
      case "canada":
        return "🇨🇦";
      case "frança":
      case "france":
        return "🇫🇷";
      case "reino unido":
      case "uk":
        return "🇬🇧";
      default:
        return "🇧🇷";
    }
  };

  const maxIndex = Math.max(0, mentors.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      // Loop infinito: volta ao início quando chega ao final
      if (prev >= maxIndex) {
        return 0;
      }
      return prev + 1;
    });
  }, [maxIndex]);

  // Autoplay: avança automaticamente a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [currentIndex, maxIndex, handleNext]); // Atualiza quando o índice ou máximo mudar

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl text-[#19184b]">
              Nossos <span className="text-[#f54a12]">Mentores</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais de alto nível que compartilham experiências reais do
              mercado
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f54a12]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (mentors.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl text-[#19184b]">
              Nossos <span className="text-[#f54a12]">Mentores</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais de alto nível que compartilham experiências reais do
              mercado
            </p>
          </div>
          <div className="text-center text-gray-500">
            Nenhum mentor encontrado.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mentors Carousel */}
        <div className="mb-20">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl text-[#19184b]">
              Nossos <span className="text-[#f54a12]">Mentores</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais de alto nível que compartilham experiências reais do
              mercado
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${
                    currentIndex * (100 / itemsPerPage)
                  }%)`,
                }}
              >
                {mentors.map((mentor) => {
                  // Handle both Strapi v4 structure (with attributes) and direct structure
                  const mentorData = mentor.attributes ?? mentor;
                  const { rating, count } = calculateRating(mentorData.reviews);
                  const mentorImage =
                    ("data" in (mentorData.imagem || {})
                      ? (mentorData.imagem as StrapiImage)?.data?.attributes
                          ?.url
                      : (mentorData.imagem as { url: string })?.url) || "";

                  return (
                    <div
                      key={mentor.id}
                      className="flex-shrink-0 px-4"
                      style={{ width: `${100 / itemsPerPage}%` }}
                    >
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 min-h-[320px]">
                        <div className="flex gap-5 mb-6">
                          {/* Small circular photo */}
                          <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-full">
                            <ImageWithFallback
                              src={mentorImage || ""}
                              alt={mentorData.nome || "Mentor"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold text-[#19184b] truncate">
                                {mentorData.nome}
                              </h3>
                              <span className="text-2xl">
                                {getCountryFlag(mentorData.pais || "Brasil")}
                              </span>
                            </div>
                            <p className="text-base font-medium text-[#f54a12] mb-3">
                              {mentorData.profissao}
                            </p>
                            <div className="inline-block px-2 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-xs">
                              {mentorData.cursos} cursos
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                          <p className="text-base text-gray-600 line-clamp-3 leading-relaxed">
                            {mentorData.descricao}
                          </p>
                          {mentorData.descricao &&
                            mentorData.descricao.length > 150 && (
                              <button
                                onClick={() => {
                                  setSelectedMentor(mentor);
                                  setIsModalOpen(true);
                                }}
                                className="text-[#f54a12] hover:text-[#e03d0f] text-sm font-medium mt-2 transition-colors"
                              >
                                Ver mais
                              </button>
                            )}
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-2">
                          {count > 0 ? (
                            <>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-[#f54a12] text-[#f54a12]" />
                                <span className="text-sm text-[#19184b]">
                                  {rating.toFixed(1)}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                ({count} avaliações)
                              </span>
                            </>
                          ) : (
                            <div className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Novo mentor
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-lg hover:bg-[#1e1b4b]/90 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-lg hover:bg-[#1e1b4b]/90 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 overflow-hidden rounded-full">
                    <ImageWithFallback
                      src={
                        ("data" in
                        ((selectedMentor.attributes ?? selectedMentor).imagem ||
                          {})
                          ? (
                              (selectedMentor.attributes ?? selectedMentor)
                                .imagem as StrapiImage
                            )?.data?.attributes?.url
                          : (
                              (selectedMentor.attributes ?? selectedMentor)
                                .imagem as { url: string }
                            )?.url) || ""
                      }
                      alt={
                        (selectedMentor.attributes ?? selectedMentor).nome ||
                        "Mentor"
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#19184b]">
                      {(selectedMentor.attributes ?? selectedMentor).nome}
                    </h2>
                    <p className="text-lg text-[#f54a12] font-medium">
                      {(selectedMentor.attributes ?? selectedMentor).profissao}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl">
                        {getCountryFlag(
                          (selectedMentor.attributes ?? selectedMentor).pais ||
                            "Brasil"
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        {(selectedMentor.attributes ?? selectedMentor).cursos}{" "}
                        cursos
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#19184b] mb-3">
                  Sobre o mentor
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {(selectedMentor.attributes ?? selectedMentor).descricao}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#19184b]">
                    {(selectedMentor.attributes ?? selectedMentor).alunos || 0}
                  </div>
                  <div className="text-sm text-gray-600">Alunos</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#19184b]">
                    {(selectedMentor.attributes ?? selectedMentor).cursos || 0}
                  </div>
                  <div className="text-sm text-gray-600">Cursos</div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="text-lg font-semibold text-[#19184b] mb-4">
                  Avaliações
                </h3>
                {(() => {
                  const mentorData =
                    selectedMentor.attributes ?? selectedMentor;
                  const reviews = mentorData.reviews || [];
                  const { rating, count } = calculateRating(reviews);

                  if (count === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Novo mentor
                        </div>
                        <p className="text-gray-500 mt-2">
                          Este mentor ainda não possui avaliações
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-[#f54a12] text-[#f54a12]" />
                          <span className="text-xl font-bold text-[#19184b]">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          ({count} avaliações)
                        </span>
                      </div>

                      <div className="space-y-4 max-h-60 overflow-y-auto">
                        {reviews.map((review, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 pb-4 last:border-b-0"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.nota
                                        ? "fill-[#f54a12] text-[#f54a12]"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {review.nome}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {review.descricao}
                            </p>
                            {review.data && (
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(review.data).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
