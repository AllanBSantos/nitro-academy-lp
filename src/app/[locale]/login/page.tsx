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
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Phone, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import { formatPhoneForDisplay } from "@/lib/utils";

// Configure axios defaults
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true; // Important for CORS

export default function LoginPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Login");

  const formatWhatsApp = (value: string) => {
    return formatPhoneForDisplay(value);
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const whatsappDigits = whatsapp.replace(/\D/g, "");

      if (whatsappDigits.length < 8 || whatsappDigits.length > 15) {
        setError(t("invalid_whatsapp"));
        return;
      }

      const { data } = await axios.post("/api/auth-code/create", {
        whatsapp: whatsappDigits,
      });

      if (!data.success) {
        throw new Error(data.message || t("login_failed"));
      }

      setSuccess(t("code_sent"));
      setCodeSent(true);
    } catch (err) {
      console.error("Send code error:", err);
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNREFUSED") {
          setError(t("connection_error"));
        } else if (err.response) {
          setError(err.response.data?.message || t("credentials_error"));
        } else if (err.request) {
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsVerifying(true);

    try {
      const whatsappDigits = whatsapp.replace(/\D/g, "");

      if (!code.trim()) {
        setError(t("code_required"));
        return;
      }

      const { data } = await axios.post("/api/auth-code/validate", {
        whatsapp: whatsappDigits,
        code: code.trim(),
      });

      if (!data.success) {
        throw new Error(data.message || t("login_failed"));
      }

      // Store the JWT token and WhatsApp number
      if (data.data?.token) {
        Cookies.set("auth_token", data.data.token, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: 7, // 7 days
        });
      }

      if (data.data?.whatsapp) {
        Cookies.set("whatsapp_number", data.data.whatsapp, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: 7, //  7 days
        });
      }

      // Redirect based on user type and linking status from Zazu
      const userType = data.data?.userType;
      const isLinked = data.data?.isLinked;
      const linkedType = data.data?.linkedType;

      if (isLinked && linkedType) {
        // User is automatically linked, redirect directly
        if (linkedType === "student") {
          router.push(`/${locale}/student`);
        } else if (linkedType === "mentor") {
          router.push(`/${locale}/admin`);
        } else if (linkedType === "admin") {
          router.push(`/${locale}/admin`);
        } else {
          router.push(`/${locale}/admin`);
        }
      } else if (userType === "student") {
        router.push(`/${locale}/student`);
      } else if (userType === "mentor") {
        router.push(`/${locale}/admin`);
      } else if (userType === "admin") {
        router.push(`/${locale}/admin`);
      } else {
        // If userType is "new_user" or undefined, this should not happen
        console.error(
          "CRITICAL ERROR: User should not be redirected to identify",
          {
            timestamp: new Date().toISOString(),
            userType,
            isLinked,
            linkedType,
            fullData: data.data,
            environment: process.env.NODE_ENV,
            whatsapp: whatsappDigits,
            code: code.trim(),
          }
        );

        setError(
          `Erro interno: Tipo de usuário inválido (${userType}). Verifique os logs do console para mais detalhes.`
        );
        setIsVerifying(false);
        return;
      }
    } catch (err) {
      console.error("Verify code error:", err);
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNREFUSED") {
          setError(t("connection_error"));
        } else if (err.response) {
          setError(err.response.data?.message || t("invalid_code"));
        } else if (err.request) {
          setError(t("no_response_error"));
        } else {
          setError(t("request_error"));
        }
      } else {
        setError(t("unexpected_error"));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      const whatsappDigits = whatsapp.replace(/\D/g, "");

      const { data } = await axios.post("/api/auth-code/create", {
        whatsapp: whatsappDigits,
      });

      if (!data.success) {
        throw new Error(data.message || t("login_failed"));
      }

      setSuccess(t("code_sent"));
    } catch (err) {
      console.error("Resend code error:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || t("credentials_error"));
        } else {
          setError(t("request_error"));
        }
      } else {
        setError(t("unexpected_error"));
      }
    } finally {
      setIsResending(false);
    }
  };

  // Google Login temporarily disabled - can be re-enabled in the future
  /*
  const handleGoogleLogin = () => {
    // Store the current locale before redirecting to Google
    if (typeof window !== "undefined") {
      sessionStorage.setItem("loginLocale", locale);
      localStorage.setItem("loginLocale", locale);
    }

    const redirect =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect")
        : null;
    const nextParam = redirect ? `?next=${encodeURIComponent(redirect)}` : "";
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    if (!STRAPI_URL) {
      throw new Error("NEXT_PUBLIC_STRAPI_API_URL environment variable is not set");
    }
    // Use a non-localized redirect path to satisfy Strapi regex constraints
    const frontendRedirect = `${window.location.origin}/connect/google/redirect${nextParam}`;
    const startUrl = `${STRAPI_URL}/api/connect/google?redirect=${encodeURIComponent(
      frontendRedirect
    )}`;
    window.location.href = startUrl;
  };
  */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1e1b4b] to-[#3B82F6] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white">
        <CardHeader className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={`/${locale}/logo_nitro_transparente.png`}
              alt="Nitro Academy"
              width={250}
              height={70}
              className="h-14 w-auto"
              unoptimized
            />
          </div>

          <CardTitle className="text-3xl font-bold text-gray-900">
            {t("welcome_title")}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {t("welcome_description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!codeSent ? (
            // Step 1: Enter WhatsApp number
            <form onSubmit={handleSendCode} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp"
                  className="text-sm font-medium text-gray-900"
                >
                  {t("whatsapp_label")}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder={t("whatsapp_placeholder")}
                    value={whatsapp}
                    onChange={handleWhatsAppChange}
                    className="pl-10 h-12 text-base"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-theme-orange hover:bg-theme-orange/90 text-white font-medium group"
                disabled={isLoading}
              >
                {isLoading ? t("sending_code") : t("send_code")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          ) : (
            // Step 2: Enter verification code
            <form onSubmit={handleVerifyCode} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-sm font-medium text-gray-900"
                >
                  {t("code_label")}
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder={t("code_placeholder")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="text-center text-lg tracking-widest h-12"
                  maxLength={5}
                />
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-sm text-theme-orange hover:text-theme-orange/80"
                >
                  {isResending ? t("resending_code") : t("resend_code")}
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-theme-orange hover:bg-theme-orange/90 text-white font-medium"
                disabled={isVerifying}
              >
                {isVerifying ? t("verifying_code") : t("verify_code")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={() => {
                  setCodeSent(false);
                  setCode("");
                  setError("");
                  setSuccess("");
                }}
              >
                {t("back")}
              </Button>
            </form>
          )}

          {/* Footer Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {t("terms_text")}{" "}
            <Link
              href={`/${locale}/termos`}
              className="text-theme-orange hover:underline font-medium"
            >
              {t("terms_and_privacy")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
