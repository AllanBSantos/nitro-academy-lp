import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
const logoImage = "/pt/logo_nitro_transparente.png";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: "Home", id: "home" },
    { label: "O Programa", id: "programa" },
    { label: "Projetos", id: "projetos" },
    { label: "Seja Mentor", id: "mentor" },
    { label: "Sobre Nós", href: `/${locale}/about-us` },
    { label: "FAQ", href: `/${locale}/faq` },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#19184b]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={logoImage}
              alt="Nitro Academy"
              width={120}
              height={40}
              className="h-10 w-auto cursor-pointer"
              onClick={() => scrollToSection("home")}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) =>
              item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[#f9f9fa] hover:text-[#f54a12] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-[#f9f9fa] hover:text-[#f54a12] transition-colors duration-200"
                >
                  {item.label}
                </button>
              )
            )}
            <Button
              onClick={() => scrollToSection("escola")}
              className="bg-[#f54a12] hover:bg-[#d43e0f] text-white"
            >
              Quero a Nitro na minha Escola
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#f9f9fa] hover:text-[#f54a12] transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#19184b] border-t border-[#599fe9]/20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {menuItems.map((item) =>
              item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block w-full text-left px-3 py-2 text-[#f9f9fa] hover:text-[#f54a12] hover:bg-[#1e1b4b] rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 text-[#f9f9fa] hover:text-[#f54a12] hover:bg-[#1e1b4b] rounded-md transition-colors"
                >
                  {item.label}
                </button>
              )
            )}
            <Button
              onClick={() => scrollToSection("escola")}
              className="w-full bg-[#f54a12] hover:bg-[#d43e0f] text-white mt-2"
            >
              Quero a Nitro na minha Escola
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
