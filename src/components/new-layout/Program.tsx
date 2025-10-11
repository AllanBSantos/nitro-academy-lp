import { Palette, Code, Briefcase, Users, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fetchTrilhasWithCourseCount, TrilhaWithCount } from "@/lib/strapi";
import { useState, useEffect } from "react";

export function Program() {
  const [tracks, setTracks] = useState<TrilhaWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrilhas = async () => {
      try {
        const trilhasData = await fetchTrilhasWithCourseCount();
        setTracks(trilhasData);
      } catch (error) {
        console.error("Error loading trilhas:", error);
        // Fallback para dados mockados
        setTracks([
          {
            id: 1,
            nome: "Criatividade e Bem-Estar",
            descricao:
              "Desenvolva sua criatividade e aprenda a cuidar do seu bem-estar físico e mental",
            courseCount: 12,
          },
          {
            id: 2,
            nome: "Tecnologia",
            descricao:
              "Domine as ferramentas digitais e aprenda a criar soluções tecnológicas inovadoras",
            courseCount: 15,
          },
          {
            id: 3,
            nome: "Negócios",
            descricao:
              "Entenda como funcionam os negócios e desenvolva uma mentalidade empreendedora",
            courseCount: 10,
          },
          {
            id: 4,
            nome: "Liderança",
            descricao:
              "Aprenda a liderar equipes e projetos com inteligência emocional e visão estratégica",
            courseCount: 8,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTrilhas();
  }, []);

  // Mapear ícones e cores para cada trilha
  const getTrackConfig = (nome: string) => {
    switch (nome.toLowerCase()) {
      case "criatividade e bem-estar":
        return { icon: Palette, color: "#f54a12" };
      case "tecnologia":
        return { icon: Code, color: "#599fe9" };
      case "negócios":
        return { icon: Briefcase, color: "#3B82F6" };
      case "liderança":
        return { icon: Users, color: "#03A9F4" };
      default:
        return { icon: Palette, color: "#f54a12" };
    }
  };

  return (
    <section
      id="programa"
      className="py-12 md:py-20 bg-gradient-to-br from-[#19184b] via-[#1e1b4b] to-[#19184b] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 border-2 border-[#599fe9] rounded-full"></div>
        <div className="absolute bottom-2 md:bottom-10 left-10 w-48 h-48 border-2 border-[#f54a12] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl text-[#f9f9fa]">
            O <span className="text-[#f54a12]">programa</span>
          </h2>
          <p className="text-lg md:text-xl text-[#f9f9fa]/80 max-w-3xl mx-auto">
            Ao longo de 3 anos, os estudantes exploram 6 projetos, desenvolvendo
            habilidades essenciais para o futuro. Podendo participar de projetos
            de 4 trilhas de conhecimento especializadas:
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-8 md:mb-16">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f54a12]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {tracks.map((item, index) => {
                const config = getTrackConfig(item.nome);
                const Icon = config.icon;
                return (
                  <motion.div
                    key={item.id}
                    className="relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 flex flex-col h-full"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                        style={{ backgroundColor: config.color }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center space-y-2 flex-grow">
                        <h3 className="text-xl text-[#f9f9fa]">{item.nome}</h3>
                        <p className="text-[#f9f9fa]/70">{item.descricao}</p>
                        <div className="pt-2">
                          <span className="text-[#f9f9fa]/60 text-sm">
                            {item.courseCount} cursos
                          </span>
                        </div>
                      </div>
                      <button
                        className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2.5 text-[#f9f9fa] transition-all duration-300 flex items-center justify-center gap-2 group"
                        style={{
                          borderColor: config.color + "40",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            config.color + "20";
                          e.currentTarget.style.borderColor = config.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255, 255, 255, 0.1)";
                          e.currentTarget.style.borderColor =
                            config.color + "40";
                        }}
                      >
                        Explorar Trilha
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
