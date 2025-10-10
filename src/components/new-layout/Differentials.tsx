import { Users, Lightbulb, Brain, Award } from "lucide-react";
import { motion } from "motion/react";

export function Differentials() {
  const differentials = [
    {
      icon: Users,
      title: "Turmas de 15 a 25 alunos",
      description: "Turmas reduzidas possibilitam acompanhamento individualizado, participação ativa e um ambiente de aprendizado dinâmico, colaborativo e acolhedor.",
      gradient: "from-[#599fe9] to-[#3B82F6]",
    },
    {
      icon: Lightbulb,
      title: "Metodologia baseada em projetos práticos",
      description: "Cada projeto é estruturado em torno de desafios reais, que estimulam a criatividade, a resolução de problemas e o trabalho em equipe.",
      gradient: "from-[#03A9F4] to-[#599fe9]",
    },
    {
      icon: Brain,
      title: "Competências empreendedoras essenciais para a vida",
      description: "Mais do que formar futuros profissionais, a Nitro forma jovens empreendedores, criativos e conscientes. As aulas desenvolvem competências fundamentais para qualquer caminho que o aluno escolha seguir.",
      gradient: "from-[#3B82F6] to-[#599fe9]",
    },
    {
      icon: Award,
      title: "Mentores de alto nível",
      description: "São empreendedores, coaches e especialistas de mercado que trazem conhecimento prático e experiências reais que despertam o interesse dos adolescentes.",
      gradient: "from-[#f54a12] to-[#d43e0f]",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl text-[#19184b]">
            Diferenciais <span className="text-[#f54a12]">Nitro</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="group relative bg-white rounded-2xl p-8 md:p-10 shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl md:text-2xl text-[#19184b] mb-4">{item.title}</h3>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">{item.description}</p>
                </div>

                {/* Decorative dot */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-[#f54a12] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
