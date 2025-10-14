import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function PricingCTA() {
  const t = useTranslations("NewHome.PricingCTA");
  const totalPrice = "10.260";
  const installments = "855";
  const installmentCount = 12;

  const benefits = useMemo(
    () => t.raw("benefits") as string[],
    [t]
  );

  return (
    <section className="relative py-12 md:py-24 overflow-hidden bg-gradient-to-br from-[#19184b] via-[#2d2b6b] to-[#599fe9]">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#f54a12] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#599fe9] rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}

        {/* Main Title */}
        <h2 className="text-4xl md:text-6xl text-white mb-6 animate-fade-in-up">
          {t.rich("title", {
            highlight: (chunks) => (
              <span className="text-[#f54a12]">{chunks}</span>
            ),
          })}
        </h2>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {t("subtitle")}
        </p>

        {/* Benefits Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-left bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-[#f54a12] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/90">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Pricing Box */}
        <div
          className="bg-white/10 backdrop-blur-md rounded-3xl border-2 border-white/20 p-8 md:p-12 max-w-2xl mx-auto mb-10 animate-fade-in-up shadow-2xl"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Price */}
          <div className="mb-6">
            <p className="text-white/80 mb-2">{t("labels.totalInvestment")}</p>
            <div className="flex items-start justify-center gap-2">
              <span className="text-2xl md:text-3xl text-white mt-1">R$</span>
              <span className="text-4xl md:text-5xl text-white">
                {totalPrice}
              </span>
            </div>
          </div>

          {/* Installments */}
          <div className="py-6 border-t border-b border-white/20">
            <p className="text-white/80 mb-2">{t("labels.installmentsIntro")}</p>
            <div className="text-2xl md:text-3xl text-white">
              {installmentCount}x {t("labels.of")}{" "}
              <span className="text-[#f54a12]">R$ {installments}</span>
            </div>
            <p className="text-sm text-white/60 mt-2">
              {t("labels.installmentsNote")}
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Button
              onClick={() =>
                window.open(
                  "https://www.asaas.com/c/kem15ghizhrc0x1c",
                  "_blank"
                )
              }
              className="w-full bg-[#f54a12] hover:bg-[#d43e0f] text-white px-8 py-6 rounded-2xl shadow-2xl hover:shadow-[0_20px_60px_rgba(245,74,18,0.4)] transition-all duration-300 hover:scale-105"
            >
              {t("cta.button")}
            </Button>
            <p className="text-sm text-white/60 mt-4">
              {t("cta.guarantee")}
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p
          className="text-white/70 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {t("footer")}
        </p>
      </div>
    </section>
  );
}
