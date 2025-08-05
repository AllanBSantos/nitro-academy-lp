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

      // Redirect to admin page based on locale
      router.push(`/${locale}/admin`);
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
