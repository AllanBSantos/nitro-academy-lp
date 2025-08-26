"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

// Configure axios defaults
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true; // Important for CORS

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use the proxy endpoint instead of direct API call
      const { data } = await axios.post(
        "/api/auth/login",
        {
          identifier: email,
          password,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!data.success || !data.data?.token) {
        throw new Error(data.message || t("login_failed"));
      }

      // Store the token in a secure cookie
      Cookies.set("auth_token", data.data.token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: 7, // 7 days
      });

      // Check user role and redirect accordingly
      if (data.data?.user?.role?.type === "student") {
        router.push(`/${locale}/student`);
      } else if (data.data?.user?.role?.type === "mentor") {
        router.push(`/${locale}/admin`);
      } else if (data.data?.user?.role?.type === "admin") {
        router.push(`/${locale}/admin`);
      } else {
        // Default to admin for authenticated users
        router.push(`/${locale}/admin`);
      }
    } catch (err) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNREFUSED") {
          setError(t("connection_error"));
        } else if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(err.response.data?.message || t("credentials_error"));
        } else if (err.request) {
          // The request was made but no response was received
          setError(t("no_response_error"));
        } else {
          setError(t("request_error"));
        }
      } else {
        setError(t("unexpected_error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email_label")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password_label")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password_placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? t("hide_password") : t("show_password")}
                  </span>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-4 text-gray-500 text-sm">{t("or")}</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Store the current locale before redirecting to Google
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("loginLocale", locale);
                    localStorage.setItem("loginLocale", locale);
                  }

                  const redirect =
                    typeof window !== "undefined"
                      ? new URLSearchParams(window.location.search).get(
                          "redirect"
                        )
                      : null;
                  const nextParam = redirect
                    ? `?next=${encodeURIComponent(redirect)}`
                    : "";
                  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
                  if (!STRAPI_URL) {
                    throw new Error(
                      "NEXT_PUBLIC_STRAPI_URL environment variable is not set"
                    );
                  }
                  // Use a non-localized redirect path to satisfy Strapi regex constraints
                  const frontendRedirect = `${window.location.origin}/connect/google/redirect${nextParam}`;
                  const startUrl = `${STRAPI_URL}/api/connect/google?redirect=${encodeURIComponent(
                    frontendRedirect
                  )}`;
                  window.location.href = startUrl;
                }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("sign_in_google")}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("signing_in") : t("sign_in")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
