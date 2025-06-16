"use client";
import Image from "next/image";
import Link from "next/link";
import LocaleSwitch from "@/components/LocaleSwitch";
import TeacherDialog from "@/components/TeacherDialog";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Header() {
  const t = useTranslations("Faq");
  const footerT = useTranslations("Footer");
  const params = useParams();
  const locale = (params?.locale as string) || "pt"; // Default to 'pt' if no locale

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
          <TeacherDialog>
            <button className="font-bold px-4 py-2 border border-theme-orange bg-transparent text-theme-orange hover:bg-theme-orange hover:text-white transition-colors rounded">
              {t("Seja um professor Nitro Academy!")}
            </button>
          </TeacherDialog>
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
                  <TeacherDialog>
                    <button className="w-full font-bold px-4 py-2 border border-theme-orange bg-transparent text-theme-orange hover:bg-theme-orange hover:text-white transition-colors rounded">
                      {t("Seja um professor Nitro Academy!")}
                    </button>
                  </TeacherDialog>
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
