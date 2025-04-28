"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ChildGuyProps {
  locale: string;
}

export default function ChildGuy({ locale }: ChildGuyProps) {
  const t = useTranslations("ChildGuy");
  return (
    <div className="h-[46rem] relative flex justify-center items-center">
      <Image
        src={`/${locale}/crianca-menino.png`}
        alt="Menino usando computador"
        width={300}
        height={300}
        priority={true}
        unoptimized
        className="h-[46rem] w-full absolute object-cover brightness-75"
      />
      <p className="font-montserrat-regular text-4xl relative pl-10 pr-32 pt-4">
        {t("+ Autonomia, criatividade e preparo para o futuro")}
      </p>
    </div>
  );
}
