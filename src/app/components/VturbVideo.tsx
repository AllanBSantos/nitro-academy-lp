"use client";

import Script from "next/script";
import Image from "next/image";
import { CSSProperties } from "react";

const containerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
};

const backdropStyle: CSSProperties = {
  WebkitBackdropFilter: "blur(5px)",
  backdropFilter: "blur(5px)",
  position: "absolute",
  top: 0,
  height: "100%",
  width: "100%",
  borderRadius: "12px",
};

const playerWrapperStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  overflow: "hidden",
};

export default function VturbVideo() {
  return (
    <div className="h-full">
      <div id="vid_67dabe7b49c4b7bf82565f10" style={containerStyle}>
        <div style={playerWrapperStyle}>
          <Image
            id="thumb_67dabe7b49c4b7bf82565f10"
            src="https://images.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/players/67dabe7b49c4b7bf82565f10/thumbnail.jpg"
            alt="thumbnail"
            fill
            className="object-cover rounded-xl"
            priority
          />
          <div id="backdrop_67dabe7b49c4b7bf82565f10" style={backdropStyle} />
        </div>
      </div>

      <Script
        src="https://scripts.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/players/67dabe7b49c4b7bf82565f10/player.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
