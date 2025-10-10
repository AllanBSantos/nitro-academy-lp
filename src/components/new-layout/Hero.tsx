import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#19184b] via-[#1e1b4b] to-[#19184b]"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#599fe9]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f54a12]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#03A9F4]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Decorative Geometric Shapes */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute top-1/4 right-1/4 w-32 h-32 text-[#599fe9]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="10" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-1/4 left-1/4 w-24 h-24 text-[#f54a12]" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            className="text-left space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl text-[#f9f9fa] leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Acelerando <span className="text-[#f54a12]">talentos</span>,<br />
              preparando <span className="text-[#599fe9]">futuros</span>.
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-[#f9f9fa]/80 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Complementamos o ensino tradicional com disciplinas práticas e mentores de alto nível, 
              preparando adolescentes para o novo mercado de trabalho.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                onClick={() => scrollToSection("projetos")}
                className="bg-[#f54a12] hover:bg-[#d43e0f] text-white px-8 py-6 rounded-xl group"
              >
                Ver Projetos
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollToSection("escola")}
                variant="outline"
                className="border-[#599fe9] text-[#599fe9] hover:bg-[#599fe9] hover:text-white px-8 py-6 rounded-xl"
              >
                Quero a Nitro na minha escola
              </Button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758612214848-04e700d192ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlciUyMHN0dWRlbnQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MDAyMjI5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Estudante da Nitro Academy"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Decorative Elements around image */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-24 bg-[#f54a12] rounded-full opacity-20 blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#599fe9] rounded-full opacity-20 blur-xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            ></motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#f9f9fa]/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#f54a12] rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}