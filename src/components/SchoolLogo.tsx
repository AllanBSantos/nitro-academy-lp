"use client";

import Image from "next/image";
import { useState } from "react";

interface SchoolLogoProps {
  logoUrl: string;
  schoolName: string;
  altText?: string;
}

export default function SchoolLogo({
  logoUrl,
  schoolName,
  altText,
}: SchoolLogoProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const fullUrl = logoUrl.startsWith("http")
    ? logoUrl
    : `${
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
      }${logoUrl}`;

  if (imageError) {
    return (
      <div className="w-24 h-24 mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm font-medium">
          {schoolName.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
      <Image
        src={fullUrl}
        alt={altText || schoolName}
        fill
        className="object-contain group-hover:scale-105 transition-transform duration-200"
        sizes="(max-width: 768px) 96px, (max-width: 1024px) 96px, 96px"
        onError={handleImageError}
      />
    </div>
  );
}
