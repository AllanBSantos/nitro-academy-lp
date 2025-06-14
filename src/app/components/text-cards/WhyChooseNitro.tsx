"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface WhyChooseNitroProps {
  locale: string;
}

const titles = [
  "Turmas reduzidas (máximo 10 alunos)",
  "Ensino personalizado",
  "Desenvolvimento de habilidades do século XXI",
  "Flexibilidade de horários",
  "Professores de alto nível",
  "Uso produtivo do tempo livre",
];

export default function WhyChooseNitro({ locale }: WhyChooseNitroProps) {
  const t = useTranslations("WhyChooseNitro");
  return (
    <div className="py-12 px-4 md:px-0">
      <h1 className="text-theme-orange font-gilroy-extrabold text-4xl md:text-6xl text-center mb-10">
        {t("Por que escolher a Nitro?")}
      </h1>
      <div className="md:flex md:flex-wrap md:justify-between md:items-center md:w-full md:mt-10 gap-8">
        {titles.map((title) => (
          <div
            key={title}
            className="md:w-1/3 md:flex md:flex-col md:items-center bg-white rounded-xl shadow-md p-6 mb-8"
          >
            <div>
              <Image
                src={`/${locale}/logo-azul.png`}
                alt="Logo Nitro"
                width={64}
                height={64}
                className="mb-4"
                unoptimized
              />
              <p className="font-montserrat-regular text-xl md:text-2xl text-center">
                {t(title)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
