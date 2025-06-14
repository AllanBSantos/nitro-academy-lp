"use client";
import Image from "next/image";
import Link from "next/link";
import LocaleSwitch from "@/components/LocaleSwitch";
import TeacherDialog from "@/components/TeacherDialog";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function Header() {
  const t = useTranslations("Faq");
  const footerT = useTranslations("Footer");
  const params = useParams();
  const locale = (params?.locale as string) || "pt"; // Default to 'pt' if no locale

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

        <nav className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}`}
              className="text-white hover:text-[#03A9F4] transition-colors"
            >
              {footerT("home")}
            </Link>
            <Link
              href={`/${locale}/about-us`}
              className="text-white hover:text-[#03A9F4] transition-colors"
            >
              {footerT("about_us")}
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="text-white hover:text-[#03A9F4] transition-colors"
            >
              {footerT("faq")}
            </Link>
          </div>
        </nav>

        <div className="flex items-center gap-6 flex-shrink-0">
          <TeacherDialog>
            <button className="font-bold px-4 py-2 border border-theme-orange bg-transparent text-theme-orange hover:bg-theme-orange hover:text-white transition-colors rounded">
              {t("Seja um professor Nitro Academy!")}
            </button>
          </TeacherDialog>

          <LocaleSwitch />
        </div>
      </header>
    </section>
  );
}
