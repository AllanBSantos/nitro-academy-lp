"use client";

import Script from "next/script";
import { CSSProperties } from "react";

const containerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "42.85% 0 0",
  overflow: "hidden",
};

const imgStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  borderRadius: "12px",
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
    <div className="py-12 px-4">
      <div id="vid_67dabe7b49c4b7bf82565f10" style={containerStyle}>
        <div style={playerWrapperStyle}>
          <img
            id="thumb_67dabe7b49c4b7bf82565f10"
            src="https://images.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/players/67dabe7b49c4b7bf82565f10/thumbnail.jpg"
            alt="thumbnail"
            style={imgStyle}
          />
          <div id="backdrop_67dabe7b49c4b7bf82565f10" style={backdropStyle} />
        </div>
      </div>

      {/* player.js da VTurb */}
      <Script
        src="https://scripts.converteai.net/3a4fbb06-ca28-4858-9d27-5208e40d8e6d/players/67dabe7b49c4b7bf82565f10/player.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
