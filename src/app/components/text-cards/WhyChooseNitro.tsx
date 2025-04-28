"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

const titles = [
  "Turmas reduzidas (máximo 10 alunos)",
  "Ensino personalizado",
  "Desenvolvimento de habilidades do século XXI",
  "Flexibilidade de horários",
  "Professores de alto nível",
  "Uso produtivo do tempo livre",
];

export default function WhyChooseNitro() {
  const t = useTranslations("WhyChooseNitro");
  return (
    <div className="p-12 md:p-0 md:py-12">
      <h1 className="text-theme-orange font-gilroy-extrabold text-6xl pl-4 pr-6 md:pl-16 md:pr-18">
        {t("Por que escolher a Nitro?")}
      </h1>
      <div className="md:flex md:flex-wrap md:justify-between md:items-center md:w-full md:mt-10">
        {titles.map((title) => (
          <div
            key={title}
            className="md:w-1/3 md:flex md:flex-col md:items-center"
          >
            <div>
              <Image
                src="logo-azul.png"
                alt="Logo Nitro"
                width={64}
                height={64}
                className="pt-10"
              />
              <p className="font-montserrat-regular text-2xl pl-1 pr-5 pt-4 w-64">
                {t(title)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
