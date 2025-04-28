"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

function TeenGuy() {
  const t = useTranslations("TeenGuy");
  return (
    <div className="relative h-[46rem] flex items-center justify-center">
      <Image
        src="adolescente-menino.png"
        alt="Adolescente usando o computador"
        priority={true}
        width={540}
        height={540}
        className="absolute w-full h-[46rem] object-cover brightness-75"
      />
      <div className="relative font-montserrat-regular font-bold leading-8">
        <div className="flex items-center">
          <Image src="arrow.svg" alt="Arrow right" width={28} height={28} />
          <h1 className="text-[1.8rem] text-4xl">{t("Transforme")}</h1>
        </div>
        <h1 className="text-[1.8rem] text-4xl">{t("tempo livre")}</h1>
        <div className="flex">
          <h1 className="text-[1.8rem] text-4xl">{t("em talento")}</h1>
          <Image
            src={"arrow.svg"}
            alt="Arrow right"
            width={28}
            height={28}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

export default TeenGuy;
