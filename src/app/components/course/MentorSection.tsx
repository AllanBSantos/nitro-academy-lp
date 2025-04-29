import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CardProps } from "../Card";

interface MentorSectionProps {
  course: CardProps;
}

export default function MentorSection({ course }: MentorSectionProps) {
  const [isMentorImageTall, setIsMentorImageTall] = useState(false);

  return (
    <section id="mentor-section" className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1e1b4b] mb-8">Mentor</h2>

        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full overflow-hidden">
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
              {course.mentor.instagram && (
                <div className="mt-4 flex items-center justify-center">
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
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#1e1b4b] mb-2">
                  {course.mentor.name}
                </h3>
                {course.mentor.profissao && (
                  <p className="text-gray-600 italic">
                    {course.mentor.profissao}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {course.mentor.nota !== undefined && course.mentor.nota > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#3B82F6] text-xl">★</span>
                    <div>
                      <p className="text-sm text-gray-600">Avaliação</p>
                      <p className="font-semibold text-[#1e1b4b]">
                        {course.mentor.nota}
                      </p>
                    </div>
                  </div>
                )}
                {course.mentor.avaliacoes !== undefined &&
                  course.mentor.avaliacoes > 0 && (
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
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Avaliações</p>
                        <p className="font-semibold text-[#1e1b4b]">
                          {course.mentor.avaliacoes.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}
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
                      <p className="text-sm text-gray-600">Alunos</p>
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
                      <p className="text-sm text-gray-600">Cursos</p>
                      <p className="font-semibold text-[#1e1b4b]">
                        {course.mentor.courses}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {course.mentor.descricao || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
