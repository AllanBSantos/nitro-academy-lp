import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ChildGirl() {
  const t = useTranslations("ChildGirl");
  return (
    <div className="relative h-[50rem] flex justify-center md:items-center">
      <Image
        src="crianca-menina.png"
        alt="Criança digitando no notebook"
        width={300}
        height={300}
        priority={true}
        className="absolute w-full h-[50rem] object-cover brightness-75"
      />
      <h1 className="relative font-montserrat-regular text-4xl font-bold px-12 py-20 md:mt-20">
        {t("Mentores incríveis e metodologia baseada em projetos")}
      </h1>
    </div>
  );
}
