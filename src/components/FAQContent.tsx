"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { fetchFAQs, FAQ } from "@/lib/strapi";
import Footer from "./Footer";

export default function FAQContent() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const t = useTranslations("FAQ");

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const data = await fetchFAQs();
        setFaqs(data);
      } catch (err) {
        setError("Failed to load FAQs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#1e1b4b] text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <>
      <section className="relative bg-gradient-to-r from-[#1e1b4b] to-[#3B82F6] text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl opacity-90">{t("subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                  className="w-full flex items-center justify-between p-6 bg-[#1e1b4b] text-white hover:bg-[#2d2a5f] transition-colors duration-300"
                >
                  <h3 className="text-xl font-semibold text-left pr-8">
                    {faq.attributes.pergunta}
                  </h3>
                  <span className="text-2xl flex-shrink-0">
                    {expandedFaq === faq.id ? "−" : "+"}
                  </span>
                </button>
                {expandedFaq === faq.id && (
                  <div className="p-6 bg-white">
                    <div className="prose prose-lg max-w-none text-gray-700">
                      {faq.attributes.resposta
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <Footer />
      </section>
    </>
  );
}
