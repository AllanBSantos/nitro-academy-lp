"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

function GoogleRedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
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

        const locale = (params?.locale as string) || "pt";
        const redirectTo = nextPath || `/${locale}/admin`;
        router.replace(redirectTo);
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

export default function GoogleRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md text-center">
            <div className="text-gray-700">Carregando...</div>
          </div>
        </div>
      }
    >
      <GoogleRedirectContent />
    </Suspense>
  );
}
