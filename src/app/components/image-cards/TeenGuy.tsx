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
        <div className="flex-1 flex flex-col items-start text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-12 font-montserrat-regular">
            {t("title")}
          </h1>
          <p className="text-lg md:text-2xl text-white max-w-xl mb-12">
            {t("subtitle")}
          </p>
          <a
            href="#cursos"
            onClick={scrollToCourses}
            className="mt-2 px-8 py-3 bg-theme-orange text-white font-bold rounded shadow-lg hover:bg-orange-500 transition-all text-lg"
          >
            {t("cta")}
          </a>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="rounded-2xl shadow-2xl overflow-hidden bg-white p-2 md:p-4">
            <Image
              src={`/${locale}/adolescente-menino.png`}
              alt="Adolescente usando o computador"
              width={380}
              height={380}
              className="object-contain w-[220px] h-[220px] md:w-[340px] md:h-[340px]"
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
