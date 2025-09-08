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
import { Phone } from "lucide-react";
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
          expires: 7, // 7 days
        });
      }

      // Redirect based on user type and linking status from Zazu
      const userType = data.data?.userType;
      const isLinked = data.data?.isLinked;
      const linkedType = data.data?.linkedType;

      // Debug logs for production troubleshooting
      console.log("Login redirect data:", {
        userType,
        isLinked,
        linkedType,
        fullData: data.data,
        environment: process.env.NODE_ENV,
      });

      if (isLinked && linkedType) {
        // User is automatically linked, redirect directly
        console.log("Redirecting based on linked type:", linkedType);
        if (linkedType === "student") {
          console.log("Redirecting to student page");
          router.push(`/${locale}/student`);
        } else if (linkedType === "mentor") {
          console.log("Redirecting to admin page (mentor)");
          router.push(`/${locale}/admin`);
        } else if (linkedType === "admin") {
          console.log("Redirecting to admin page (admin)");
          router.push(`/${locale}/admin`);
        } else {
          console.log("Redirecting to admin page (default)");
          router.push(`/${locale}/admin`);
        }
      } else if (userType === "student") {
        console.log("Redirecting to student page based on userType");
        router.push(`/${locale}/student`);
      } else if (userType === "mentor") {
        console.log("Redirecting to admin page based on userType (mentor)");
        router.push(`/${locale}/admin`);
      } else if (userType === "admin") {
        console.log("Redirecting to admin page based on userType (admin)");
        router.push(`/${locale}/admin`);
      } else {
        // If userType is "new_user" or undefined, redirect to identification
        console.log("Redirecting to identify page - userType:", userType);
        router.push(`/${locale}/identify`);
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
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
    if (!STRAPI_URL) {
      throw new Error("NEXT_PUBLIC_STRAPI_URL environment variable is not set");
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

        {!codeSent ? (
          // Step 1: Enter WhatsApp number
          <form onSubmit={handleSendCode}>
            <CardContent className="space-y-4">
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
                <Label htmlFor="whatsapp">{t("whatsapp_label")}</Label>
                <div className="relative">
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder={t("whatsapp_placeholder")}
                    value={whatsapp}
                    onChange={handleWhatsAppChange}
                    required
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
                <p className="text-sm text-gray-500">{t("whatsapp_example")}</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("sending_code") : t("send_code")}
              </Button>

              {/* Google Login temporarily disabled - can be re-enabled in the future
              <div className="relative w-full">
                <div className="my-4 flex items-center">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="mx-4 text-gray-500 text-sm">{t("or")}</span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
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
              */}
            </CardFooter>
          </form>
        ) : (
          // Step 2: Enter verification code
          <form onSubmit={handleVerifyCode}>
            <CardContent className="space-y-4">
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
                <Label htmlFor="code">{t("code_label")}</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder={t("code_placeholder")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="text-center text-lg tracking-widest"
                  maxLength={5}
                />
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-sm"
                >
                  {isResending ? t("resending_code") : t("resend_code")}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? t("verifying_code") : t("verify_code")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCodeSent(false);
                  setCode("");
                  setError("");
                  setSuccess("");
                }}
              >
                Voltar
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
