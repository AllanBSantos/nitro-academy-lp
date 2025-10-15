"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/new-layout/ui/button";
import { Input } from "@/components/new-layout/ui/input";
import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import { formatPhoneForDisplay } from "@/lib/utils";

// Configure axios defaults
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true; // Important for CORS

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
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

  // Check if user is already logged in
  useEffect(() => {
    const authToken = Cookies.get("auth_token");
    if (authToken) {
      // User is already logged in, redirect to admin
      router.push(`/${locale}/admin`);
    }
  }, [router, locale]);

  const formatPhone = (value: string) => {
    return formatPhoneForDisplay(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const phoneDigits = phoneNumber.replace(/\D/g, "");

      if (phoneDigits.length < 8 || phoneDigits.length > 15) {
        setError(t("invalid_whatsapp"));
        return;
      }

      const { data } = await axios.post("/api/auth-code/create", {
        whatsapp: phoneDigits,
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
      const phoneDigits = phoneNumber.replace(/\D/g, "");

      if (!code.trim()) {
        setError(t("code_required"));
        return;
      }

      const { data } = await axios.post("/api/auth-code/validate", {
        whatsapp: phoneDigits,
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
      const phoneDigits = phoneNumber.replace(/\D/g, "");

      const { data } = await axios.post("/api/auth-code/create", {
        whatsapp: phoneDigits,
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
    <div className="min-h-screen bg-[#19184b] relative overflow-hidden flex items-center justify-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f54a12] rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#599fe9] rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#599fe9] rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#f54a12 1px, transparent 1px), linear-gradient(90deg, #f54a12 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 mt-20">
        {/* Login Card */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl text-white mb-3">{t("welcome_back")}</h2>
            <p className="text-white/60 text-lg">
              {t("welcome_back_description")}
            </p>
          </div>

          {!codeSent ? (
            // Step 1: Enter phone number
            <form onSubmit={handleSendCode} className="space-y-6">
              {error && (
                <motion.div
                  className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-red-200 text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 text-green-200 text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {success}
                </motion.div>
              )}

              {/* Phone Number Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="phone" className="block text-white/80 mb-3">
                  {t("phone_label")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("phone_placeholder")}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-16 rounded-2xl focus:border-[#599fe9] focus:ring-[#599fe9]/20 transition-all"
                    required
                  />
                </div>
                <p className="mt-3 text-white/50 text-sm">
                  {t("phone_description")}
                </p>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full h-16 bg-gradient-to-r from-[#f54a12] to-[#f54a12]/80 hover:from-[#f54a12]/90 hover:to-[#f54a12]/70 text-white rounded-2xl group shadow-lg shadow-[#f54a12]/20 hover:shadow-xl hover:shadow-[#f54a12]/30 transition-all"
                  disabled={isLoading}
                >
                  <span className="text-lg">
                    {isLoading ? t("sending_code") : t("send_code")}
                  </span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </form>
          ) : (
            // Step 2: Enter verification code
            <form onSubmit={handleVerifyCode} className="space-y-6">
              {error && (
                <motion.div
                  className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-red-200 text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 text-green-200 text-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {success}
                </motion.div>
              )}

              {/* Code Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="code" className="block text-white/80 mb-3">
                  {t("code_label")}
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder={t("code_placeholder")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-16 rounded-2xl focus:border-[#599fe9] focus:ring-[#599fe9]/20 transition-all text-center text-lg tracking-widest"
                  maxLength={5}
                  required
                />
              </motion.div>

              {/* Resend Code Button */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-[#599fe9] hover:text-[#f54a12] transition-colors"
                >
                  {isResending ? t("resending_code") : t("resend_code")}
                </Button>
              </motion.div>

              {/* Verify Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  className="w-full h-16 bg-gradient-to-r from-[#f54a12] to-[#f54a12]/80 hover:from-[#f54a12]/90 hover:to-[#f54a12]/70 text-white rounded-2xl group shadow-lg shadow-[#f54a12]/20 hover:shadow-xl hover:shadow-[#f54a12]/30 transition-all"
                  disabled={isVerifying}
                >
                  <span className="text-lg">
                    {isVerifying ? t("verifying_code") : t("verify_code")}
                  </span>
                </Button>
              </motion.div>

              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-16 border-white/20 text-white hover:bg-white/10 rounded-2xl"
                  onClick={() => {
                    setCodeSent(false);
                    setCode("");
                    setError("");
                    setSuccess("");
                  }}
                >
                  {t("back")}
                </Button>
              </motion.div>
            </form>
          )}

          {/* Additional Info */}
          <motion.div
            className="mt-8 pt-8 border-t border-white/10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-white/50 text-sm">
              {t("terms_agreement")}{" "}
              <Link
                href={`/${locale}/termos`}
                className="text-[#599fe9] hover:text-[#f54a12] transition-colors"
              >
                {t("terms_link")}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
