"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
export default function ChildGuy() {
  const t = useTranslations("ChildGuy");
  return (
    <div className="h-[46rem] relative flex justify-center items-center">
      <Image
        src="crianca-menino.png"
        alt="Menino usando computador"
        width={300}
        height={300}
        priority={true}
        className="h-[46rem] w-full absolute object-cover brightness-75"
      />
      <p className="font-montserrat-regular text-4xl relative pl-10 pr-32 pt-4">
        {t("+ Autonomia, criatividade e preparo para o futuro")}
      </p>
    </div>
  );
}
