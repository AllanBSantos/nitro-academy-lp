"use client";

import Script from "next/script";
import Image from "next/image";
import { CSSProperties } from "react";
import { useTranslations } from "next-intl";

const containerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
};

const videoContainerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  paddingTop: "56.25%", // 16:9 aspect ratio
};

const playerWrapperStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

export default function VturbVideo() {
  const t = useTranslations("VturbVideo");

  return (
    <div style={containerStyle}>
      <h2 className="text-3xl font-bold text-black mb-8 text-center drop-shadow">
        {t("title")}
      </h2>
      <div
        id="vid_67dabe7b49c4b7bf82565f10"
        style={{
          ...videoContainerStyle,
          boxShadow: "0 8px 32px 0 rgba(30,27,75,0.15)",
        }}
      >
        <div style={playerWrapperStyle}>
          <Image
            id="thumb_67dabe7b49c4b7bf82565f10"
            src="https://images.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/players/67dabe7b49c4b7bf82565f10/thumbnail.jpg"
            alt="thumbnail"
            fill
            quality={100}
            className="object-contain rounded-xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      </div>

      <Script
        src="https://scripts.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/players/67dabe7b49c4b7bf82565f10/player.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
