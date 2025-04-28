"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function MiniUniversity() {
  const t = useTranslations("MiniUniversity");
  return (
    <div className=" py-10 bg-theme-orange rounded-t-2xl  font-gilroy-light font-bold text-3xl">
      <p className=" font-montserrat-black text-4xl text-background text-center pb-14">
        {t("Uma mini universidade")}
      </p>
      <div className="pl-10 flex flex-col justify-center gap-10 md:flex-row md:p-0">
        <div className="md:flex md:items-center md:flex-col md:text-center md:w-1/3">
          <Image
            src="correct.svg"
            width={75}
            height={75}
            alt="icone correto"
            className="w-20 h-20"
          />
          <p className="w-80 pt-5 md:w-auto">
            {t("Escolha suas matérias a cada semestre")}
          </p>
        </div>
        <div className="md:flex md:items-center md:flex-col md:text-center md:w-1/3">
          <Image
            src="target.svg"
            width={75}
            height={75}
            alt="icone flecha ao alvo"
            className="w-20 h-20"
          />
          <p className="w-80 pt-5 md:w-auto">
            {t("Aprenda o que realmente interessa")}
          </p>
        </div>
        <div className="md:flex md:items-center md:flex-col md:text-center md:w-1/3">
          <Image
            src="online-class.svg"
            width={75}
            height={75}
            alt="icone aula online"
            className="w-20 h-20"
          />
          <p className="w-80 pt-5 md:w-auto">
            {t("Aulas 100% online, interativas e ao vivo")}
          </p>
        </div>
      </div>
    </div>
  );
}
