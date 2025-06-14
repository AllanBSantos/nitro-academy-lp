"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const params = useParams();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("Footer");

  return (
    <>
      <footer className="w-full h-48">
        <div className="flex flex-col items-center px-4 pt-8">
          <Image
            src={`/${locale}/logo-frase-azul.png`}
            alt={t("logo_alt")}
            width={330}
            height={91}
            className="h-24 w-80"
          />
          <hr className="border-[#562637] bg-[#562637] w-[20rem] h-[0.05rem] mt-4" />
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link
              href="https://www.instagram.com/nitroacademybr/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                src={`/${locale}/instagram.svg`}
                alt={t("instagram_alt")}
                width={30}
                height={30}
              />
            </Link>
            <Link
              href="https://www.facebook.com/nitroacademybr"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                src={`/${locale}/facebook.svg`}
                alt={t("facebook_alt")}
                width={30}
                height={30}
              />
            </Link>
            <Link
              href="https://www.youtube.com/@nitroacademybr"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                src={`/${locale}/youtube.svg`}
                alt={t("youtube_alt")}
                width={30}
                height={30}
              />
            </Link>
          </div>
          <div className="flex gap-6 mt-6"></div>
        </div>
      </footer>
      <div className="w-full flex flex-col items-center justify-center gap-1 mt-4 px-8 py-1 text-xs text-white bg-background text-center">
        <span>{t("copyright")}</span>
        <Link href="/termos" className="hover:underline text-white">
          {t("terms_link")}
        </Link>
      </div>
      <Link href="https://wa.me/5511975809082?text=Visitei%20o%20site%20da%20Nitro%20Academy%20e%20queria%20saber%20mais%21">
        <div className="h-14 w-14 fixed bottom-5 right-5 rounded-full bg-[#4CC247] z-50 flex justify-center items-center shadow-[0px_0px_5px_1px_#777] transition-shadow hover:shadow-none md:h-16 md:w-16">
          <Image
            src={`/${locale}/whatsapp.svg`}
            width={45}
            height={45}
            alt={t("whatsapp_alt")}
            className="w-9 h-9"
          />
        </div>
      </Link>
    </>
  );
}
