"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function InternationalSection() {
  const t = useTranslations("InternationalSection");
  const whyChooseT = useTranslations("WhyChooseNitro");
  const childGuyT = useTranslations("ChildGuy");

  const features = [
    "Turmas reduzidas (máximo 10 alunos)",
    "Ensino personalizado",
    "Desenvolvimento de habilidades do século XXI",
    "Flexibilidade de horários",
    "Professores de alto nível",
    "Uso produtivo do tempo livre",
    "+ Autonomia, criatividade e preparo para o futuro",
  ];

  return (
    <section className="w-full bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-black mb-8 text-center drop-shadow">
          {t("title")}
        </h2>
        <p className="text-lg text-gray-700">{t("description")}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 w-72 min-h-[180px] mb-4 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
          >
            <Image
              src="/pt/logo-spinner.png"
              alt="Spinner"
              width={64}
              height={64}
              className="mb-4"
              unoptimized
            />
            <span className="text-base text-[#1e1b4b] font-semibold text-center">
              {idx === features.length - 1
                ? childGuyT("+ Autonomia, criatividade e preparo para o futuro")
                : whyChooseT(feature)}
            </span>
          </div>
        ))}
      </div>
      <blockquote className="max-w-2xl mx-auto text-center text-lg italic text-[#1e1b4b] border-l-4 border-theme-orange pl-4 mb-12">
        &quot;{t("quote")}&quot;
      </blockquote>
    </section>
  );
}
