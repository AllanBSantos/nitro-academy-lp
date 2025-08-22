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

        // Define default locale constant
        const DEFAULT_LOCALE = "pt";

        // Check if user exists and has a role
        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();

          // If user has no role, is new, or has role but no mentor/student association, redirect to identification
          if (
            !userData.role ||
            userData.role.type === "authenticated" ||
            (userData.role.type === "mentor" && !userData.mentor) ||
            (userData.role.type === "student" && !userData.student)
          ) {
            // Detect locale from the original redirect URL or default to Portuguese
            const originalRedirect = searchParams.get("redirect");
            let locale = DEFAULT_LOCALE;

            if (originalRedirect) {
              const localeMatch = originalRedirect.match(/^\/([a-z]{2})\//);
              if (localeMatch) {
                locale = localeMatch[1];
              }
            }

            router.replace(`/${locale}/identify`);
            return;
          }
        }

        // If "next" is provided, use it; else default to Portuguese admin
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
