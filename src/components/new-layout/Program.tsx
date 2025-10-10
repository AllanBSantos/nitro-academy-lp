import { Palette, Code, Briefcase, Users, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Program() {
  const tracks = [
    {
      title: "Criatividade e Bem-Estar",
      description: "Desenvolva sua criatividade e aprenda a cuidar do seu bem-estar físico e mental",
      icon: Palette,
      color: "#f54a12",
      courseCount: 12,
    },
    {
      title: "Tecnologia",
      description: "Domine as ferramentas digitais e aprenda a criar soluções tecnológicas inovadoras",
      icon: Code,
      color: "#599fe9",
      courseCount: 15,
    },
    {
      title: "Negócios",
      description: "Entenda como funcionam os negócios e desenvolva uma mentalidade empreendedora",
      icon: Briefcase,
      color: "#3B82F6",
      courseCount: 10,
    },
    {
      title: "Liderança",
      description: "Aprenda a liderar equipes e projetos com inteligência emocional e visão estratégica",
      icon: Users,
      color: "#03A9F4",
      courseCount: 8,
    },
  ];

  return (
    <section id="programa" className="py-12 md:py-20 bg-gradient-to-br from-[#19184b] via-[#1e1b4b] to-[#19184b] relative overflow-hidden">
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
            Ao longo de 3 anos, os estudantes exploram 6 projetos, desenvolvendo habilidades essenciais para o futuro. Podendo participar de projetos de 4 trilhas de conhecimento especializadas:
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-8 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {tracks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index} 
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 flex flex-col h-full"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center space-y-2 flex-grow">
                      <h3 className="text-xl text-[#f9f9fa]">{item.title}</h3>
                      <p className="text-[#f9f9fa]/70">{item.description}</p>
                      <div className="pt-2">
                        <span className="text-[#f9f9fa]/60 text-sm">
                          {item.courseCount} cursos
                        </span>
                      </div>
                    </div>
                    <button
                      className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2.5 text-[#f9f9fa] transition-all duration-300 flex items-center justify-center gap-2 group"
                      style={{ 
                        borderColor: item.color + '40',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = item.color + '20';
                        e.currentTarget.style.borderColor = item.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = item.color + '40';
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
        </div>
      </div>
    </section>
  );
}
