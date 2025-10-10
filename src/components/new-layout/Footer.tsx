import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
const logoImage = "/pt/logo_nitro_transparente.png";

export function Footer() {
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

  const quickLinks = [
    { label: "Home", id: "home" },
    { label: "Nossa História", id: "sobre" },
    { label: "Nossos Projetos", id: "projetos" },
    { label: "Seja Mentor", id: "mentor" },
    { label: "Quero a Nitro na minha Escola", id: "escola" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-[#19184b] text-[#f9f9fa] pt-12 md:pt-16 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Image
              src={logoImage}
              alt="Nitro Academy"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <p className="text-[#f9f9fa]/70">
              Acelerando talentos e preparando futuros através de educação
              prática e inovadora.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-[#f54a12] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-6">Acesso Rápido</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-[#f9f9fa]/70 hover:text-[#f54a12] transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl mb-6">Contato</h3>
            <ul className="space-y-3 text-[#f9f9fa]/70">
              <li>
                <a
                  href="mailto:contato@nitro.academy"
                  className="hover:text-[#f54a12] transition-colors"
                >
                  barbara@nitro.academy
                </a>
              </li>
              <li>
                <a
                  href="tel:+551199999999"
                  className="hover:text-[#f54a12] transition-colors"
                >
                  (11) 99999-9999
                </a>
              </li>
              <li>São Paulo, SP - Brasil</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#f9f9fa]/50 text-sm">
              © {new Date().getFullYear()} Nitro Academy. Todos os direitos
              reservados.
            </p>
            <div className="flex gap-6 text-sm text-[#f9f9fa]/50">
              <a href="#" className="hover:text-[#f54a12] transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-[#f54a12] transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
