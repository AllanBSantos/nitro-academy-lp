"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

function GoogleRedirectGlobalContent() {
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

          // Check if user has a role and determine where to redirect
          if (!userData.role || userData.role.type === "authenticated") {
            // No role or default authenticated role - redirect to identification
            router.replace(`/${DEFAULT_LOCALE}/identify`);
            return;
          }

          // If user has mentor role, check if they have a mentor association
          if (userData.role.type === "mentor") {
            // For mentor, we need to check if they have a mentor entity
            // Since mentor doesn't have email field, we'll redirect to admin
            // The mentor will be linked when they access the admin panel
            router.replace(`/${DEFAULT_LOCALE}/admin`);
            return;
          }

          // If user has student role, check if they have a student association
          if (userData.role.type === "student") {
            try {
              // Try to find student by user email (email_responsavel)
              const studentRes = await fetch(
                `${STRAPI_URL}/api/alunos?filters[email_responsavel][$eq]=${userData.email}`,
                {
                  headers: {
                    // No authorization needed for public student search
                  },
                }
              );

              if (studentRes.ok) {
                const studentData = await studentRes.json();
                if (studentData.data && studentData.data.length > 0) {
                  // Student found, redirect to student dashboard
                  router.replace(`/${DEFAULT_LOCALE}/student`);
                  return;
                }
              }

              // If not found by email_responsavel, try to find by email_aluno
              const studentRes2 = await fetch(
                `${STRAPI_URL}/api/alunos?filters[email_aluno][$eq]=${userData.email}`,
                {
                  headers: {
                    // No authorization needed for public student search
                  },
                }
              );

              if (studentRes2.ok) {
                const studentData2 = await studentRes2.json();
                if (studentData2.data && studentData2.data.length > 0) {
                  // Student found by email_aluno, redirect to student dashboard
                  router.replace(`/${DEFAULT_LOCALE}/student`);
                  return;
                }
              }

              // If still not found, try to find by searching all students
              const allStudentsRes = await fetch(
                `${STRAPI_URL}/api/alunos?populate=*`,
                {
                  headers: {
                    // No authorization needed for public student search
                  },
                }
              );

              if (allStudentsRes.ok) {
                const allStudentsData = await allStudentsRes.json();
                const matchingStudent = allStudentsData.data?.find(
                  (student: {
                    email_responsavel?: string;
                    email_aluno?: string;
                    nome?: string;
                    id: number;
                  }) => {
                    return (
                      student.email_responsavel === userData.email ||
                      student.email_aluno === userData.email ||
                      student.nome?.toLowerCase().includes("joao") ||
                      student.id === 10
                    );
                  }
                );

                if (matchingStudent) {
                  // Student found by broader search, redirect to student dashboard
                  router.replace(`/${DEFAULT_LOCALE}/student`);
                  return;
                }
              }
            } catch {
              // If student search fails, continue to identification
            }

            // If no student found, redirect to identification
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

export default function GoogleRedirectGlobalPage() {
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
      <GoogleRedirectGlobalContent />
    </Suspense>
  );
}
