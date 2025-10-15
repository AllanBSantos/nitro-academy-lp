"use client";

import { Button } from "./ui/button";
import { School, Mail, Phone, Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function SchoolCTA() {
  const t = useTranslations("NewHome.SchoolCTA");
  const [formData, setFormData] = useState({
    schoolName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const emailBody = t("email.body", {
        schoolName: formData.schoolName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "barbara@nitro.academy",
          subject: t("email.subject", { schoolName: formData.schoolName }),
          text: emailBody,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setIsSubmitted(true);
      setFormData({
        schoolName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      alert(t("errors.submit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="escola"
      className="py-12 md:py-20 bg-gradient-to-br from-[#19184b] via-[#1e1b4b] to-[#19184b] relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#f54a12] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#599fe9] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f54a12]/10 border border-[#f54a12]/20 rounded-full">
              <School className="w-4 h-4 text-[#f54a12]" />
              <span className="text-sm text-[#f54a12]">{t("badge")}</span>
            </div>

            <h2 className="text-3xl md:text-5xl text-[#f9f9fa]">
              {t.rich("title", {
                highlight: (chunks) => (
                  <span className="text-[#f54a12]">{chunks}</span>
                ),
              })}
            </h2>

            <p className="text-lg text-[#f9f9fa]/80">
              {t("description")}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#f9f9fa]/80">
                <div className="w-10 h-10 bg-[#599fe9]/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#599fe9]" />
                </div>
                <span>barbara@nitro.academy</span>
              </div>
              <div className="flex items-center gap-3 text-[#f9f9fa]/80">
                <div className="w-10 h-10 bg-[#599fe9]/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#599fe9]" />
                </div>
                <span>(11) 97580‑9082</span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl text-[#f9f9fa] mb-2">{t("success.title")}</h3>
                <p className="text-[#f9f9fa]/80">{t("success.message")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    placeholder={t("form.schoolName")}
                    className="bg-white/10 border-white/20 text-[#f9f9fa] placeholder:text-[#f9f9fa]/50"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("form.email")}
                    className="bg-white/10 border-white/20 text-[#f9f9fa] placeholder:text-[#f9f9fa]/50"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t("form.phone")}
                    className="bg-white/10 border-white/20 text-[#f9f9fa] placeholder:text-[#f9f9fa]/50"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t("form.message")}
                    rows={4}
                    className="bg-white/10 border-white/20 text-[#f9f9fa] placeholder:text-[#f9f9fa]/50"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f54a12] hover:bg-[#d43e0f] text-white py-6 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? t("form.sending") : t("form.submit")}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* School Special Packages Notice - Below Form */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#599fe9]/20 to-[#f54a12]/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#f54a12]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl text-[#f9f9fa] mb-2">{t("packages.title")}</h3>
                <p className="text-[#f9f9fa]/80">{t("packages.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
