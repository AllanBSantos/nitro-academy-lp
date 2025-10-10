import { useEffect, useRef, useState } from "react";

export function Competencies() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const competencies = [
    { name: "Criatividade", angle: 0, color: "#f54a12" },
    { name: "Comunicação", angle: 72, color: "#599fe9" },
    { name: "Inovação", angle: 144, color: "#03A9F4" },
    { name: "Pensamento Crítico", angle: 216, color: "#3B82F6" },
    { name: "Liderança", angle: 288, color: "#f54a12" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl text-[#19184b]">
            Competências <span className="text-[#f54a12]">Empreendedoras</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A cada semestre os estudantes têm acesso a projetos guiados por mentores experientes, que despertam competências como: 
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Desktop: Circular Layout */}
          <div className="hidden md:block relative h-[500px]">
            {/* Center Circle */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-[#f54a12] to-[#d43e0f] rounded-full flex items-center justify-center shadow-2xl z-10 transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
            >
              <span className="text-white text-center px-4">Estudante</span>
            </div>

            {/* Competency Nodes */}
            {competencies.map((comp, index) => {
              const radius = 200;
              const angleRad = (comp.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <div key={index}>
                  {/* Connection Line */}
                  <svg
                    className={`absolute top-1/2 left-1/2 w-full h-full pointer-events-none transition-opacity duration-700`}
                    style={{ 
                      transform: "translate(-50%, -50%)",
                      opacity: isVisible ? 0.3 : 0,
                      transitionDelay: `${400 + index * 100}ms`
                    }}
                  >
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`calc(50% + ${x}px)`}
                      y2={`calc(50% + ${y}px)`}
                      stroke={comp.color}
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Node */}
                  <div
                    className={`absolute top-1/2 left-1/2 group cursor-pointer transition-all duration-700 ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      transitionDelay: `${300 + index * 100}ms`
                    }}
                  >
                    <div className="relative">
                      <div
                        className="w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${comp.color} 0%, ${comp.color}dd 100%)`,
                        }}
                      >
                        <span className="text-white text-center px-3">{comp.name}</span>
                      </div>
                      {/* Pulse effect on hover */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle, ${comp.color}40 0%, transparent 70%)`,
                          transform: "scale(1.5)",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: Circular Layout (smaller) */}
          <div className="md:hidden relative h-[350px]">
            {/* Center Circle */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-[#f54a12] to-[#d43e0f] rounded-full flex items-center justify-center shadow-2xl z-10 transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
            >
              <span className="text-white text-center px-2 text-sm">Estudante</span>
            </div>

            {/* Competency Nodes */}
            {competencies.map((comp, index) => {
              const radius = 130;
              const angleRad = (comp.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <div key={index}>
                  {/* Connection Line */}
                  <svg
                    className={`absolute top-1/2 left-1/2 w-full h-full pointer-events-none transition-opacity duration-700`}
                    style={{ 
                      transform: "translate(-50%, -50%)",
                      opacity: isVisible ? 0.3 : 0,
                      transitionDelay: `${400 + index * 100}ms`
                    }}
                  >
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`calc(50% + ${x}px)`}
                      y2={`calc(50% + ${y}px)`}
                      stroke={comp.color}
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Node */}
                  <div
                    className={`absolute top-1/2 left-1/2 transition-all duration-700 ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      transitionDelay: `${300 + index * 100}ms`
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${comp.color} 0%, ${comp.color}dd 100%)`,
                      }}
                    >
                      <span className="text-white text-center px-2 text-xs">{comp.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-gray-600">
            Cada competência é trabalhada de forma integrada nos projetos, 
            garantindo o desenvolvimento completo do aluno.
          </p>
        </div>
      </div>
    </section>
  );
}
