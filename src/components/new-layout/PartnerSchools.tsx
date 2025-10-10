import { useState, useEffect } from "react";
import { fetchPartnerSchools } from "@/lib/strapi";
import { PartnerSchool } from "@/types/strapi";
import Image from "next/image";

export function PartnerSchools() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [schools, setSchools] = useState<PartnerSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schools from Strapi
  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        const schoolsData = await fetchPartnerSchools();
        setSchools(schoolsData);
        setError(null);
      } catch (err) {
        console.error("Error loading schools:", err);
        setError("Erro ao carregar escolas parceiras");
        // Fallback to mock data if API fails
        setSchools([
          {
            id: 1,
            documentId: "mock-1",
            name: "Colégio Excellence",
            logo: "🏫",
          },
          {
            id: 2,
            documentId: "mock-2",
            name: "Instituto Educacional",
            logo: "🎓",
          },
          { id: 3, documentId: "mock-3", name: "Escola do Futuro", logo: "🚀" },
          { id: 4, documentId: "mock-4", name: "Academia Premium", logo: "⭐" },
          {
            id: 5,
            documentId: "mock-5",
            name: "Centro Educacional",
            logo: "📚",
          },
          { id: 6, documentId: "mock-6", name: "Escola Inovação", logo: "💡" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
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

  useEffect(() => {
    if (schools.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % schools.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [schools.length]);

  // Don't render if loading and no schools
  if (loading && schools.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl text-[#19184b]">
              Escolas <span className="text-[#f54a12]">Parceiras</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Instituições de ensino que confiam na Nitro Academy
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f54a12]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no schools available
  if (!loading && schools.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl text-[#19184b]">
            Escolas <span className="text-[#f54a12]">Parceiras</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Instituições de ensino que confiam na Nitro Academy
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {[...schools, ...schools].map((school, index) => (
              <div
                key={`${school.id}-${index}`}
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="text-center">
                    <div className="mb-4 h-20 flex items-center justify-center">
                      {school.logo && school.logo.startsWith("http") ? (
                        <Image
                          src={school.logo}
                          alt={`Logo da ${school.name}`}
                          width={80}
                          height={80}
                          className="max-h-20 max-w-40 object-contain"
                          onError={(e) => {
                            // Fallback to emoji if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback =
                              target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "block";
                          }}
                        />
                      ) : null}
                      <div
                        className="text-7xl"
                        style={{
                          display:
                            school.logo && school.logo.startsWith("http")
                              ? "none"
                              : "block",
                        }}
                      >
                        {school.logo || "🏫"}
                      </div>
                    </div>
                    <h3 className="text-xl text-[#19184b]">{school.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {schools.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#f54a12] w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
