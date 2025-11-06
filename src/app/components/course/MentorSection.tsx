import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CardProps } from "@/types/card";
import { useTranslations } from "next-intl";

interface MentorSectionProps {
  course: CardProps;
}

export default function MentorSection({ course }: MentorSectionProps) {
  const [isMentorImageTall, setIsMentorImageTall] = useState(false);
  const t = useTranslations("MentorSection");

  // Não renderizar se não houver mentor
  if (!course.mentor || !course.mentor.name) {
    return null;
  }

  const mentorReviews = course.mentor.reviews || [];
  const mentorRating =
    mentorReviews.length > 0
      ? Number(
          (
            mentorReviews.reduce((sum, r) => sum + r.nota, 0) /
            mentorReviews.length
          ).toFixed(1)
        )
      : 0;
  const mentorReviewCount = mentorReviews.length;

  const getFlagSrc = (pais?: string) => {
    const brazilFlag = "/en/brasil-flag.png";
    const usaFlag = "/en/usa-flag.png";
    const canadaFlag = "/en/canada-flag.png";
    const franceFlag = "/en/france-flag.png";
    switch ((pais || "Brasil").toLowerCase()) {
      case "brasil":
        return brazilFlag;
      case "estados unidos":
        return usaFlag;
      case "canadá":
      case "canada":
        return canadaFlag;
      case "frança":
        return franceFlag;
      default:
        return brazilFlag;
    }
  };

  return (
    <section id="mentor-section" className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">{t("title")}</h2>

        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-lg overflow-hidden">
                <Image
                  src={course.mentor.image}
                  alt={course.mentor.name}
                  width={160}
                  height={160}
                  className={`w-full h-full object-cover ${
                    isMentorImageTall ? "object-top" : "object-center"
                  }`}
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    const aspectRatio = naturalHeight / naturalWidth;
                    setIsMentorImageTall(aspectRatio > 1.5);
                  }}
                />
              </div>
              {(course.mentor.instagram || course.mentor.linkedin_url) && (
                <div className="mt-4 flex flex-col items-center gap-3">
                  {course.mentor.instagram && (
                    <Link
                      href={course.mentor.instagram}
                      target="_blank"
                      className="text-[#3B82F6] hover:text-[#1e1b4b] transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>{course.mentor.instagram_label}</span>
                    </Link>
                  )}
                  {course.mentor.linkedin_url && (
                    <Link
                      href={course.mentor.linkedin_url.startsWith('http://') || course.mentor.linkedin_url.startsWith('https://') 
                        ? course.mentor.linkedin_url 
                        : `https://${course.mentor.linkedin_url}`}
                      target="_blank"
                      className="text-[#3B82F6] hover:text-[#1e1b4b] transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>{course.mentor.linkedin_label || "LinkedIn"}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#1e1b4b] mb-2 flex items-center gap-2">
                    {course.mentor.name}
                    <Image
                      src={getFlagSrc(course.mentor.pais)}
                      alt={course.mentor.pais || "Brasil"}
                      width={24}
                      height={24}
                      className="inline w-6 h-6 rounded-sm ml-1"
                    />
                  </h3>
                  {course.mentor.profissao && (
                    <p className="text-gray-600 italic mb-2">
                      {course.mentor.profissao}
                    </p>
                  )}
                  {mentorReviewCount === 0 && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {t("stats.new_mentor")}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {course.mentor.descricao || ""}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6">
                  {course.mentor.students > 0 && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#3B82F6]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("stats.students")}
                        </p>
                        <p className="font-semibold text-[#1e1b4b]">
                          {course.mentor.students.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}
                  {course.mentor.courses > 0 && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#3B82F6]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("stats.courses")}
                        </p>
                        <p className="font-semibold text-[#1e1b4b]">
                          {course.mentor.courses}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-72 flex-shrink-0">
                <div className="flex flex-col items-center justify-center rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold text-[#1e1b4b] mb-1">
                    {mentorRating > 0 ? mentorRating.toFixed(1) : "-"}
                  </div>
                  <div className="flex justify-center mb-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(mentorRating)
                            ? "text-[#3B82F6] fill-current"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    {mentorReviewCount > 0
                      ? t("stats.based_on", { count: mentorReviewCount })
                      : t("stats.no_reviews")}
                  </div>
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = mentorReviews.filter(
                      (r) => r.nota === star
                    ).length;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 min-w-[12px]">
                          {star}
                        </span>
                        <svg
                          className="w-3 h-3 text-[#3B82F6] fill-current"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-[#3B82F6] h-1 rounded-full"
                            style={{
                              width: `${
                                mentorReviewCount > 0
                                  ? (count / mentorReviewCount) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 min-w-[10px] text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
