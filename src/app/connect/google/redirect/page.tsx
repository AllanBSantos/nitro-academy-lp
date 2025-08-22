"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function GoogleRedirectGlobalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      const accessToken = searchParams.get("access_token");
      const nextPath = searchParams.get("next");
      if (!accessToken) {
        setError("Missing access token");
        return;
      }

      try {
        const STRAPI_URL =
          process.env.NEXT_PUBLIC_STRAPI_URL ||
          process.env.NEXT_PUBLIC_STRAPI_API_URL ||
          "http://localhost:1337";
        const res = await fetch(
          `${STRAPI_URL}/api/auth/google/callback?access_token=${encodeURIComponent(
            accessToken
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || `Callback failed: ${res.status}`);
        }

        const data = await res.json();
        const jwt: string | undefined = data?.jwt;
        if (!jwt) {
          throw new Error("JWT not received from Strapi");
        }

        Cookies.set("auth_token", jwt, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: 7,
        });

        // Define default locale constant - try to detect from current URL first
        let DEFAULT_LOCALE = "pt"; // fallback

        // Try to detect locale from the redirect parameter or current context
        const originalRedirect = searchParams.get("redirect");

        if (originalRedirect) {
          const localeMatch = originalRedirect.match(/^\/([a-z]{2})\//);
          if (localeMatch) {
            DEFAULT_LOCALE = localeMatch[1];
          }
        }

        // If no redirect parameter, try to detect from referrer header
        if (DEFAULT_LOCALE === "pt" && typeof window !== "undefined") {
          try {
            const referrer = document.referrer;
            if (referrer) {
              const url = new URL(referrer);
              const pathLocaleMatch = url.pathname.match(/^\/([a-z]{2})\//);
              if (pathLocaleMatch) {
                DEFAULT_LOCALE = pathLocaleMatch[1];
              }
            }
          } catch (error) {
            console.error("Referrer detection failed:", error);
          }
        }

        // If still no locale detected, try to get from the current page URL
        if (DEFAULT_LOCALE === "pt" && typeof window !== "undefined") {
          try {
            // Check if we're on a localized route
            const currentPath = window.location.pathname;

            // Check if we're on a localized route like /en/connect/google/redirect
            const currentLocaleMatch = currentPath.match(
              /^\/([a-z]{2})\/connect\/google\/redirect/
            );

            if (currentLocaleMatch) {
              DEFAULT_LOCALE = currentLocaleMatch[1];
            }
          } catch (error) {
            console.error("Current path detection failed:", error);
          }
        }

        // If still no locale detected, try to get from sessionStorage or localStorage
        if (DEFAULT_LOCALE === "pt" && typeof window !== "undefined") {
          try {
            // Check if we stored the locale before redirecting to Google
            const storedLocale =
              sessionStorage.getItem("loginLocale") ||
              localStorage.getItem("loginLocale");

            if (
              storedLocale &&
              (storedLocale === "en" || storedLocale === "pt")
            ) {
              DEFAULT_LOCALE = storedLocale;
            }
          } catch (error) {
            console.error("Storage detection failed:", error);
          }
        }

        // Fetch admin emails from Strapi
        let adminEmails: string[] = [];
        try {
          const adminResponse = await fetch("/api/admins/list");
          if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            adminEmails = adminData.adminEmails || [];
          }
        } catch {
          // Fallback to empty array if admin fetch fails
          adminEmails = [];
        }

        // Check if user exists and has a role
        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();

          // Check if user email is in admin list
          if (
            userData.email &&
            adminEmails.includes(userData.email.toLowerCase())
          ) {
            // Admin email detected - redirect directly to admin
            const target = nextPath || `/${DEFAULT_LOCALE}/admin`;
            router.replace(target);
            return;
          }

          // Check if user already has admin role
          if (userData.role && userData.role.type === "admin") {
            // Admin users go directly to admin panel
            const target = nextPath || `/${DEFAULT_LOCALE}/admin`;
            router.replace(target);
            return;
          }

          // If user has no role, is new, or has role but no mentor/student association, redirect to identification
          if (
            !userData.role ||
            userData.role.type === "authenticated" ||
            (userData.role.type === "mentor" && !userData.mentor) ||
            (userData.role.type === "student" && !userData.student)
          ) {
            // Use the detected locale for identification
            router.replace(`/${DEFAULT_LOCALE}/identify`);
            return;
          }
        }

        // If "next" is provided, use it; else use detected locale
        const target = nextPath || `/${DEFAULT_LOCALE}/admin`;
        router.replace(target);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unexpected error";
        setError(message);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        {error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : (
          <div className="text-gray-700">Conectando com o Google...</div>
        )}
      </div>
    </div>
  );
}
