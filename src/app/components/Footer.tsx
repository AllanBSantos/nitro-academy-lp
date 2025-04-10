"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Footer() {
  const params = useParams();
  const locale = (params?.locale as string) || "pt"; // Default to 'pt' if no locale

  return (
    <>
      <footer className="w-full h-96">
        <div className="flex flex-col items-center px-4 pt-8">
          <Image
            src={`/${locale}/logo-frase-azul.png`}
            alt="logo nitro academy com frase"
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
                alt="link para conta do instagram"
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
                alt="link para conta do facebook"
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
                alt="link para canal do youtube"
                width={30}
                height={30}
              />
            </Link>
          </div>
          <div className="flex gap-6 mt-6">
            <Link
              href={`/${locale}`}
              className="text-white hover:text-[#03A9F4] transition-colors"
            >
              Home
            </Link>
            <Link
              href={`/${locale}/about-us`}
              className="text-white hover:text-[#03A9F4] transition-colors"
            >
              Sobre Nós
            </Link>
          </div>
        </div>
      </footer>
      <Link href="https://wa.me/5511975809082?text=Visitei%20o%20site%20da%20Nitro%20Academy%20e%20queria%20saber%20mais%21">
        <div className="h-14 w-14 fixed bottom-5 right-5 rounded-full bg-[#4CC247] z-50 flex justify-center items-center shadow-[0px_0px_5px_1px_#777] transition-shadow hover:shadow-none md:h-16 md:w-16">
          <Image
            src={`/${locale}/whatsapp.svg`}
            width={45}
            height={45}
            alt="whatsapp"
            className="w-9 h-9"
          />
        </div>
      </Link>
    </>
  );
}
