import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Mentors() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

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
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mentors = [
    {
      name: "Ana Silva",
      title: "CEO TechStartup",
      image: "https://images.unsplash.com/photo-1540058404349-2e5fabf32d75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1lbnRvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjAwMjIyOTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      area: "Inovação",
      country: "🇧🇷",
      description: "15 anos de experiência em startups de tecnologia e inovação disruptiva",
      rating: 4.9,
      reviewCount: 127,
    },
    {
      name: "Carlos Mendes",
      title: "Diretor de Design",
      image: "https://images.unsplash.com/photo-1712903911017-7c10a3c4b3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvamVjdCUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NTk5OTE2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      area: "Criatividade",
      country: "🇺🇸",
      description: "Especialista em UX/UI com projetos premiados internacionalmente",
      rating: 5.0,
      reviewCount: 203,
    },
    {
      name: "Mariana Costa",
      title: "Head of Product",
      image: "https://images.unsplash.com/photo-1598618589695-e601731aed51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVlbmFnZXJzJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzYwMDIyMjk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      area: "Produto",
      country: "🇬🇧",
      description: "Liderou desenvolvimento de produtos em unicórnios do Vale do Silício",
      rating: 4.8,
      reviewCount: 156,
    },
    {
      name: "Roberto Santos",
      title: "CTO FinTech",
      image: "https://images.unsplash.com/photo-1758612214848-04e700d192ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlciUyMHN0dWRlbnQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MDAyMjI5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      area: "Tecnologia",
      country: "🇨🇦",
      description: "Arquiteto de soluções escaláveis para fintechs globais",
      rating: 4.9,
      reviewCount: 189,
    },
  ];

  const maxIndex = Math.max(0, mentors.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      // Loop infinito: volta ao início quando chega ao final
      if (prev >= maxIndex) {
        return 0;
      }
      return prev + 1;
    });
  };

  // Autoplay: avança automaticamente a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]); // Atualiza quando o índice ou máximo mudar

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
              Profissionais de alto nível que compartilham experiências reais do mercado
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
              >
                {mentors.map((mentor, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="flex gap-4 mb-4">
                        {/* Small circular photo */}
                        <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-full">
                          <ImageWithFallback
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg text-[#19184b] truncate">{mentor.name}</h3>
                            <span className="text-xl">{mentor.country}</span>
                          </div>
                          <p className="text-sm text-[#f54a12] mb-2">{mentor.title}</p>
                          <div className="inline-block px-2 py-1 bg-[#599fe9]/10 text-[#599fe9] rounded-full text-xs">
                            {mentor.area}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.description}</p>

                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#f54a12] text-[#f54a12]" />
                          <span className="text-sm text-[#19184b]">{mentor.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-gray-500">({mentor.reviewCount} avaliações)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
