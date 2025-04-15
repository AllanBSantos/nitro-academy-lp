import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToEmbedUrl(url: string): string {
  // Handle YouTube Shorts URLs
  if (url.includes("youtube.com/shorts/")) {
    const videoId = url.split("/shorts/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Handle regular YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  return url;
}
