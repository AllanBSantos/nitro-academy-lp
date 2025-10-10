"use client";

import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Chatwoot from "../Chatwoot";
const logoImage = "/pt/logo_nitro_transparente.png";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
    // Se não estiver na homepage, navegar para lá primeiro
    if (pathname !== `/${locale}` && pathname !== `/${locale}/`) {
      window.location.href = `/${locale}#${id}`;
      return;
    }

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
    { label: "Nossos Projetos", id: "projetos" },
    { label: "Seja Mentor", id: "mentor" },
    { label: "Quero a Nitro na minha Escola", id: "escola" },
    { label: "Nossa História", href: `/${locale}/about-us` },
    { label: "FAQ", href: `/${locale}/faq` },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/nitroacademybr/",
      label: "Instagram",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/nitroacademybr",
      label: "Facebook",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/nitroacademybr/",
      label: "LinkedIn",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@nitroacademybr",
      label: "YouTube",
    },
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
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="text-[#f9f9fa]/70 hover:text-[#f54a12] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.id!)}
                      className="text-[#f9f9fa]/70 hover:text-[#f54a12] transition-colors duration-200"
                    >
                      {link.label}
                    </button>
                  )}
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
                  href="mailto:barbara@nitro.academy"
                  className="hover:text-[#f54a12] transition-colors"
                >
                  barbara@nitro.academy
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511975809082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f54a12] transition-colors"
                >
                  (11) 97580‑9082
                </a>
              </li>
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
              <Link
                href={`/${locale}/termos`}
                className="hover:text-[#f54a12] transition-colors"
              >
                Termos de Uso e Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Chatwoot />
    </footer>
  );
}
