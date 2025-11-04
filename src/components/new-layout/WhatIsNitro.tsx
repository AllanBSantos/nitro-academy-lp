"use client";

import { Quote } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { useTranslations } from "next-intl";

export function WhatIsNitro() {
  const ref = useRef(null);
  const t = useTranslations("NewHome.WhatIsNitro");

  return (
    <section ref={ref} className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-12 space-y-4 md:space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl text-[#19184b]">
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-[#f54a12]">{chunks}</span>
              ),
            })}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/aLHangPmmfA"
              title="Nitro Academy Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Quote Section */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-[#f54a12] to-[#d43e0f] text-white rounded-2xl p-8 md:p-10 shadow-lg"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(245, 74, 18, 0.25)",
            }}
            transition={{ duration: 0.3 }}
          >
            <Quote className="w-12 h-12 mb-4 text-white/30" />
            <p className="text-lg md:text-xl mb-6">{t("quote")}</p>
            <div>
              <p className="text-white">{t("author")}</p>
              <p className="text-white/80">{t("authorRole")}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
