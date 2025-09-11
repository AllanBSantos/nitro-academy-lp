"use client";
import Image from "next/image";
import Link from "next/link";
import LocaleSwitch from "@/components/LocaleSwitch";
import TeacherDialog from "@/components/TeacherDialog";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
  const t = useTranslations("Faq");
  const footerT = useTranslations("Footer");
  const headerT = useTranslations("Header");
  const params = useParams();
  const locale = (params?.locale as string) || "pt"; // Default to 'pt' if no locale
  const [showTooltip, setShowTooltip] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();

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

  const navLinks = [
    { href: `/${locale}`, label: footerT("home") },
    { href: `/${locale}/about-us`, label: footerT("about_us") },
    { href: `/${locale}/faq`, label: footerT("faq") },
  ];

  return (
    <section className="bg-background">
      <header className="py-2 flex items-center justify-between w-full px-2 md:px-10">
        <Link href={`/${locale}`} className="flex-shrink-0">
          <Image
            src={`/${locale}/nitro-logo-azul.png`}
            alt="logo nitro academy"
            width={170}
            height={47}
            className="h-14 w-52"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#03A9F4] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <div className="relative group">
            <button className="font-bold px-4 py-2 border border-theme-orange bg-transparent text-theme-orange hover:bg-theme-orange hover:text-white transition-colors rounded flex items-center gap-2">
              {t("Faça parte da Nitro")}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <Link href={`/${locale}/more-info-page`}>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-center">
                    <div className="font-semibold text-gray-900">
                      {t("Seja uma escola Power by Nitro")}
                    </div>
                  </div>
                </Link>
                <div className="border-t border-gray-100"></div>
                <TeacherDialog>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-center">
                    <div className="font-semibold text-gray-900">
                      {t("Seja um professor Nitro Academy!")}
                    </div>
                  </div>
                </TeacherDialog>
              </div>
            </div>
          </div>

          {/* User Authentication Section */}
          {loading ? (
            <div className="flex items-center gap-2 text-white">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm">Carregando...</span>
            </div>
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.name || headerT("user")}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || headerT("user")}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {getRoleName(user.role.type)}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {user.role.type === "student" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/student`}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{headerT("student_area")}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role.type === "mentor" && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/admin`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{headerT("mentor_area")}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role.type === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/admin`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{headerT("admin_area")}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout(locale)}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{headerT("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="relative">
              <Link href={`/${locale}/login`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              {showTooltip && (
                <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-black text-white text-sm rounded-md whitespace-nowrap z-50">
                  Área administradores
                </div>
              )}
            </div>
          )}

          <LocaleSwitch />
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-none">
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-[#03A9F4] transition-colors text-lg py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4">
                  <div className="text-white text-lg py-2 font-semibold text-left">
                    {t("Faça parte da Nitro")}
                  </div>
                  <Link href={`/${locale}/more-info-page`}>
                    <div className="text-white/80 hover:text-[#03A9F4] transition-colors text-base py-2 pl-4 text-left">
                      {t("Seja uma escola Power by Nitro")}
                    </div>
                  </Link>
                  <TeacherDialog>
                    <div className="text-white/80 hover:text-[#03A9F4] transition-colors text-base py-2 pl-4 cursor-pointer text-left">
                      {t("Seja um professor Nitro Academy!")}
                    </div>
                  </TeacherDialog>
                </div>
                <div className="mt-4">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 text-white">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Carregando...</span>
                    </div>
                  ) : isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="px-4 py-2 bg-white/10 rounded-lg">
                        <p className="text-white font-medium">
                          {user.name || headerT("user")}
                        </p>
                        <p className="text-white/70 text-sm capitalize">
                          {getRoleName(user.role.type)}
                        </p>
                      </div>
                      {user.role.type === "student" && (
                        <Link href={`/${locale}/student`}>
                          <button className="w-full font-bold px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-background transition-colors rounded flex items-center justify-center gap-2">
                            <User className="h-5 w-5" />
                            {headerT("student_area")}
                          </button>
                        </Link>
                      )}
                      {user.role.type === "mentor" && (
                        <Link href={`/${locale}/admin`}>
                          <button className="w-full font-bold px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-background transition-colors rounded flex items-center justify-center gap-2">
                            <User className="h-5 w-5" />
                            {headerT("mentor_area")}
                          </button>
                        </Link>
                      )}
                      {user.role.type === "admin" && (
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
                        {headerT("logout")}
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
                <div className="mt-4">
                  <LocaleSwitch />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </section>
  );
}
