// import { useTranslations } from "next-intl";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface IntroductionProps {
  locale: string;
}

export default function Introduction({ locale }: IntroductionProps) {
  const t = useTranslations("Introduction");
  return (
    <div className="px-12 bg-background rounded-t-2xl py-10 shadow-[0px_-12px_0px_0px_#599fe9] relative md:py-32">
      <Image
        src={`/${locale}/logo-azul.png`}
        alt="Logo Nitro"
        width={65}
        height={65}
        className="h-10 w-12"
      />
      <p className="font-montserrat-regular text-left text-[1.5rem] pt-6 md:text-3xl">
        {t(
          "A Nitro Academy é uma escola online de projetos de iniciação vocacional para adolescentes entre 11 a 17 anos através de projetos práticos e estimulantes orientados por mentores experientes"
        )}
        .
      </p>
    </div>
  );
}
