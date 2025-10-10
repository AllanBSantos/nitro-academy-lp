import { useState, useEffect } from "react";

export function PartnerSchools() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(2); // Mobile: 2 cards
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

  const schools = [
    { name: "Colégio Excellence", logo: "🏫" },
    { name: "Instituto Educacional", logo: "🎓" },
    { name: "Escola do Futuro", logo: "🚀" },
    { name: "Academia Premium", logo: "⭐" },
    { name: "Centro Educacional", logo: "📚" },
    { name: "Escola Inovação", logo: "💡" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % schools.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [schools.length]);

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
                key={index}
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{school.logo}</div>
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
