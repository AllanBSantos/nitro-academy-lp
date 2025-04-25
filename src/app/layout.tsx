import { PropsWithChildren } from "react";
import localFont from "next/font/local";
import GoogleTagManager from "./components/GoogleTagManager";

import "./globals.css";
import { Metadata } from "next";

const gilroyExtrabold = localFont({
  src: "./fonts/Gilroy-Extrabold.ttf",
  variable: "--font-gilroy-extrabold",
});

const helveticaNeue = localFont({
  src: "./fonts/HelveticaNeueLTStd-MdCn.otf",
  variable: "--font-helvetica",
});

const montserratBlack = localFont({
  src: "./fonts/Montserrat-Black.otf",
  variable: "--font-montserrat-black",
});

const montserratLight = localFont({
  src: "./fonts/Montserrat-Light.otf",
  variable: "--font-montserrat-light",
});

const montserratRegular = localFont({
  src: "./fonts/Montserrat-Regular.otf",
  variable: "--font-montserrat-regular",
});

const gilroyLight = localFont({
  src: "./fonts/Gilroy-Light.otf",
  variable: "--fonts-gilroy-light",
});

export const metadata: Metadata = {
  title: "Nitro Academy",
  description: "Nitro academy",
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <body
        className={`
            ${gilroyExtrabold.variable} 
            ${helveticaNeue.variable} 
            ${montserratBlack.variable} 
            ${montserratLight.variable}
            ${montserratRegular.variable}
            ${gilroyLight.variable}
            antialiased
            tracking-wider
          `}
      >
        <GoogleTagManager />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N4C5FS8S"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {children}
      </body>
    </html>
  );
}
