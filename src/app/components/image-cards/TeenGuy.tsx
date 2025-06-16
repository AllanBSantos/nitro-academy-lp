"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface TeenGuyProps {
  locale: string;
}

function TeenGuy({ locale }: TeenGuyProps) {
  const t = useTranslations("TeenGuy");

  const scrollToCourses = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const coursesSection = document.getElementById("cursos");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-[#1e1b4b] to-[#3B82F6] text-white py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-4">
        {/* Mobile: title, description, image, CTA. Desktop: left column (title, description, CTA), right column (image) */}
        <div className="flex-1 flex flex-col items-start text-left w-full">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-montserrat-regular">
            {t("title")}
          </h1>
          <p className="text-lg md:text-2xl text-white max-w-xl mb-6">
            {t("subtitle")}
          </p>
          {/* Mobile image */}
          <div className="w-full flex justify-center mb-6 md:hidden">
            <div className="rounded-2xl shadow-2xl overflow-hidden bg-white p-2">
              <Image
                src={`/${locale}/adolescente-menino.png`}
                alt="Adolescente usando o computador"
                width={220}
                height={220}
                className="object-contain w-[220px] h-[220px]"
                unoptimized
                priority
              />
            </div>
          </div>
          {/* Mobile CTA */}
          <div className="w-full flex justify-center md:hidden">
            <a
              href="#cursos"
              onClick={scrollToCourses}
              className="w-full text-center px-8 py-3 bg-theme-orange text-white font-bold rounded shadow-lg hover:bg-orange-500 transition-all text-lg"
            >
              {t("cta")}
            </a>
          </div>
          {/* Desktop CTA */}
          <a
            href="#cursos"
            onClick={scrollToCourses}
            className="hidden md:inline-block mt-2 px-8 py-3 bg-theme-orange text-white font-bold rounded shadow-lg hover:bg-orange-500 transition-all text-lg"
          >
            {t("cta")}
          </a>
        </div>
        {/* Desktop image */}
        <div className="hidden md:flex flex-1 justify-center items-center md:order-2">
          <div className="rounded-2xl shadow-2xl overflow-hidden bg-white p-4">
            <Image
              src={`/${locale}/adolescente-menino.png`}
              alt="Adolescente usando o computador"
              width={340}
              height={340}
              className="object-contain w-[340px] h-[340px]"
              unoptimized
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeenGuy;
