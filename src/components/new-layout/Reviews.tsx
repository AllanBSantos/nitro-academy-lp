"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchTestimonials } from "@/lib/strapi";
import { ReviewCard } from "@/types/strapi";
import { useTranslations } from "next-intl";

export function Reviews() {
  const t = useTranslations("NewHome.Reviews");
  const [showAll, setShowAll] = useState(false);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackReviews = useMemo(() => {
    // No fallback data from translations, return empty array
    // Reviews will be loaded from Strapi
    return [];
  }, []);

  // Fetch reviews from Strapi
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await fetchTestimonials("pt-BR");
        if (reviewsData.length > 0) {
          setReviews(reviewsData);
        } else {
          setReviews(fallbackReviews);
        }
      } catch (err) {
        console.error("Error loading reviews:", err);
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [fallbackReviews]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 2);

  const getAvatarColor = (gender: string) => {
    return gender === "boy"
      ? "from-[#3B82F6] to-[#599fe9]"
      : "from-[#f54a12] to-[#d43e0f]";
  };

  const getAvatarEmoji = (gender: string) => {
    return gender === "boy" ? "👦" : "👧";
  };

  // Don't render if loading and no reviews
  if (loading && reviews.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 space-y-4"
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
              {t("subtitle")}
            </p>
          </motion.div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f54a12]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Always render the section, even if no reviews from Strapi
  // The fallback mock data will be used

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 space-y-4"
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
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {displayedReviews.map((review, index) => (
              <motion.div
                key={`${review.id}-${index}`}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                layout
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${getAvatarColor(
                      review.gender
                    )} rounded-full flex items-center justify-center text-2xl`}
                  >
                    {getAvatarEmoji(review.gender)}
                  </div>

                  <div className="flex-1">
                    {/* Name */}
                    <div className="mb-2">
                      <h4 className="text-lg text-[#19184b]">{review.name}</h4>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-600 mb-3">{review.comment}</p>

                    {/* Date */}
                    <p className="text-sm text-gray-400">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More/Less Button - Only show if more than 2 reviews */}
        {reviews.length > 2 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#f54a12] text-[#f54a12] bg-white rounded-full font-medium hover:bg-[#f54a12] hover:text-white transition-all duration-300"
            >
              {showAll ? t("cta.showLess") : t("cta.showMore")}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
