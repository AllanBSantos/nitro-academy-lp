"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ParentsProps {
  locale: string;
}

export default function Parents({ locale }: ParentsProps) {
  const t = useTranslations("Parents");
  return (
    <div className="h-[40rem] flex justify-center items-end">
      <Image
        src={`/${locale}/parents.jpeg`}
        alt="Pais olhando para filha adolescente"
        width={300}
        height={300}
        priority={true}
        unoptimized
        className="absolute w-full h-[40rem] object-cover brightness-[0.6]"
      />
      <h1 className="font-montserrat-regular font-bold z-10 text-xl px-10 pb-10 sm:text-3xl sm:px-28 sm:pb-20">
        &quot;
        {t(
          "Sabemos que a adolescência é uma fase de escolhas Na Nitro, nossos filhos usam o tempo livre para explorar interesses, longe das distrações das redes sociais Oferecemos um ambiente seguro, com acompanhamentos e relatórios de progresso"
        )}
        &quot;
      </h1>
    </div>
  );
}
