import { Quote } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

export function WhatIsNitro() {
  const ref = useRef(null);

  return (
    <section ref={ref} className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-12 space-y-4 md:space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl text-[#19184b]">
            O que é a <span className="text-[#f54a12]">Nitro Academy</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Aceleradora de jovens talentos que complementa o ensino tradicional
            com disciplinas práticas alinhadas com o interesse dos estudantes,
            desenvolvendo habilidades empreendedoras essenciais para qualquer
            carreira no novo mercado de trabalho
          </p>
        </motion.div>

        {/* Quote Section */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-[#f54a12] to-[#d43e0f] text-white rounded-2xl p-8 md:p-10 shadow-lg"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(245, 74, 18, 0.25)",
            }}
            transition={{ duration: 0.3 }}
          >
            <Quote className="w-12 h-12 mb-4 text-white/30" />
            <p className="text-lg md:text-xl mb-6">
              &ldquo;A educação tradicional precisa evoluir. Na Nitro,
              preparamos os jovens para os desafios reais do mercado de
              trabalho.&rdquo;
            </p>
            <div>
              <p className="text-white">Vahid Sherafat</p>
              <p className="text-white/80">Fundador Nitro Academy</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
