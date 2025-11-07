"use client";

import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LocaleSwitch from "@/app/components/LocaleSwitch";
const logoImage = "/pt/logo_nitro_transparente.png";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const headerT = useTranslations("Header");

  const whiteBackgroundPages = [`/${locale}/about-us`, `/${locale}/termos`];
  const hasWhiteBackground = whiteBackgroundPages.some((page) =>
    pathname.startsWith(page)
  );

  // Function to get translated role name
  const getRoleName = (roleType: string) => {
    switch (roleType) {
      case "student":
        return headerT("student_role");
      case "mentor":
        return headerT("mentor_role");
      case "admin":
        return headerT("admin_role");
      default:
        return roleType;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element;
        if (!target.closest(".user-menu-container")) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

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
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: "Home", id: "home" },
    { label: "Projetos", id: "projetos" },
    { label: "Seja Mentor", id: "mentor" },
    { label: "Sobre Nós", href: `/${locale}/about-us` },
    { label: "FAQ", href: `/${locale}/faq` },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || hasWhiteBackground
          ? "bg-[#19184b]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 pl-4 sm:pl-6 lg:pl-8">
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
                  onClick={() => item.id && scrollToSection(item.id)}
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

          {/* Right Side - User Auth & Locale */}
          <div className="hidden md:flex items-center space-x-4 pr-4 sm:pr-6 lg:pr-8">
            {/* User Authentication Section */}
            {loading ? (
              <div className="flex items-center gap-2 text-[#f9f9fa]">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f9f9fa]"></div>
                <span className="text-sm">Carregando...</span>
              </div>
            ) : isAuthenticated ? (
              <div className="relative user-menu-container">
                <Button
                  variant="ghost"
                  className="text-[#f9f9fa] hover:bg-white/10 flex items-center gap-2"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.name || "Usuário"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {/* Dropdown manual */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-[60] p-2">
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                      {getRoleName(user?.role?.type || "")}
                    </div>
                    <div className="border-t border-gray-200 my-1"></div>
                    {user?.role?.type === "student" && (
                      <Link
                        href={`/${locale}/student`}
                        className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="inline mr-2 h-4 w-4" />
                        {headerT("student_area")}
                      </Link>
                    )}
                    {user?.role?.type === "mentor" && (
                      <Link
                        href={`/${locale}/admin`}
                        className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="inline mr-2 h-4 w-4" />
                        {headerT("mentor_area")}
                      </Link>
                    )}
                    {user?.role?.type === "admin" && (
                      <Link
                        href={`/${locale}/admin`}
                        className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="inline mr-2 h-4 w-4" />
                        {headerT("admin_area")}
                      </Link>
                    )}
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout(locale);
                      }}
                      className="block w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <LogOut className="inline mr-2 h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href={`/${locale}/login`}>
                <Button
                  variant="ghost"
                  className="text-[#f9f9fa] hover:bg-white/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <LocaleSwitch />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#f9f9fa] hover:text-[#f54a12] transition-colors mr-4"
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
        <div className="md:hidden bg-[#19184b] border-t border-[#599fe9]/20 z-[60]">
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
                  onClick={() => item.id && scrollToSection(item.id)}
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

            {/* Mobile User Authentication Section */}
            <div className="mt-4 pt-4 border-t border-[#599fe9]/20">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-[#f9f9fa] py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f9f9fa]"></div>
                  <span className="text-sm">Carregando...</span>
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-center text-sm text-[#f9f9fa]/70 mb-2">
                    {user?.name || "Usuário"} -{" "}
                    {getRoleName(user?.role?.type || "")}
                  </div>
                  {user?.role?.type === "student" && (
                    <Link href={`/${locale}/student`}>
                      <button className="w-full font-bold px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-background transition-colors rounded flex items-center justify-center gap-2">
                        <User className="h-5 w-5" />
                        {headerT("student_area")}
                      </button>
                    </Link>
                  )}
                  {user?.role?.type === "mentor" && (
                    <Link href={`/${locale}/admin`}>
                      <button className="w-full font-bold px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-background transition-colors rounded flex items-center justify-center gap-2">
                        <User className="h-5 w-5" />
                        {headerT("mentor_area")}
                      </button>
                    </Link>
                  )}
                  {user?.role?.type === "admin" && (
                    <Link href={`/${locale}/admin`}>
                      <button className="w-full font-bold px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-background transition-colors rounded flex items-center justify-center gap-2">
                        <User className="h-5 w-5" />
                        {headerT("admin_area")}
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => logout(locale)}
                    className="w-full font-bold px-4 py-2 border border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </button>
                </div>
              ) : (
                <Link href={`/${locale}/login`}>
                  <button className="w-full font-bold px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-background transition-colors rounded flex items-center justify-center gap-2">
                    <User className="h-5 w-5" />
                    Login
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Locale Switch */}
            <div className="mt-4 pt-4 border-t border-[#599fe9]/20">
              <LocaleSwitch />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
