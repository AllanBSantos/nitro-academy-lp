import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

export interface Review {
  id: number;
  studentName: string;
  rating: number;
  comment: string;
}

interface CourseReviewsSectionProps {
  reviews: Review[];
}

export default function CourseReviewsSection({
  reviews,
}: CourseReviewsSectionProps) {
  const t = useTranslations("CourseReviews");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Se não há reviews, mostrar mensagem
  if (!reviews || reviews.length === 0) {
    return (
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
            {t("title")}
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("no_comments")}</p>
          </div>
        </div>
      </section>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // Mostrar apenas os primeiros 6 reviews na seção principal
  const displayedReviews = reviews.slice(0, 6);
  const hasMoreReviews = reviews.length > 6;

  return (
    <>
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">
            {t("title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-4">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {review.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {review.studentName}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMoreReviews && (
            <div className="text-center mt-8">
              <button
                className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg hover:bg-[#2563EB] transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                {t("view_all_reviews")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal com todas as avaliações */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1e1b4b]">
              {t("title")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {review.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {review.studentName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
