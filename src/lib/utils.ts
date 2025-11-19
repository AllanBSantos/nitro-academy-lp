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

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .trim();
}

/**
 * Formats a phone number for international use
 * If it's a Brazilian number (10-11 digits) without country code, adds 55
 * If it's already an international number, returns as is
 * @param phoneNumber - The phone number to format
 * @returns The formatted phone number
 */
export function formatInternationalPhone(phoneNumber: string): string {
  // Remove all non-digits
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // If it's already an international number (12+ digits), return as is
  if (cleanNumber.length >= 12) {
    return cleanNumber;
  }

  // If it's a Brazilian number (10-11 digits), add 55
  if (cleanNumber.length === 10 || cleanNumber.length === 11) {
    return "55" + cleanNumber;
  }

  // For other cases, return as is (could be invalid, but let the API handle validation)
  return cleanNumber;
}

/**
 * Formats a phone number for display (Brazilian format only for now)
 * @param phoneNumber - The phone number to format for display
 * @returns The formatted phone number for display
 */
export function formatPhoneForDisplay(phoneNumber: string): string {
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, "");

  // Format as Brazilian phone number
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  } else if (digits.length <= 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  } else {
    return `${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7, 11)}`;
  }
}

/**
 * Normalizes a Strapi image URL to an absolute URL
 * If the URL is already absolute (starts with http), returns as is
 * If the URL is relative (starts with /), prepends the Strapi API URL
 * @param url - The image URL from Strapi
 * @returns The normalized absolute URL
 */
export function normalizeStrapiImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // If already absolute, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // If relative, prepend Strapi API URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  // Ensure URL starts with / if it doesn't
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${strapiUrl}${normalizedPath}`;
}
