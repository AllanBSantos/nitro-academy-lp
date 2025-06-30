import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

export interface Review {
  id: number;
  studentName: string;
  rating: number;
  comment: string;
}

interface CourseRatingSectionProps {
  reviews: Review[];
}

export default function CourseRatingSection({
  reviews,
}: CourseRatingSectionProps) {
  const t = useTranslations("CourseRating");

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const distribution = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const total = reviews.length;
  const average =
    total > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : "0.0";

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < count ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">{t("title")}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Summary */}
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-[#1e1b4b] mb-2">
              {average}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(Number(average)))}
            </div>
            <div className="text-gray-600">
              {t("based_on", { count: total })}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-4">
            {distribution
              .slice()
              .reverse()
              .map((d) => (
                <div key={d.star} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[80px]">
                    <span className="text-sm text-gray-600 font-medium">
                      {d.star}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${total > 0 ? (d.count / total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 min-w-[60px] text-right">
                    {d.count}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
