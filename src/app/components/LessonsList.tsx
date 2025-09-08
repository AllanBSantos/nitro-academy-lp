"use client";

import { useTranslations } from "next-intl";
import { Calendar, Play, FileText, ExternalLink } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useEffect, useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme: string;
              size: string;
              text: string;
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

interface Lesson {
  id: number;
  data: string;
  aula_status: string;
  link_aula: string;
  arquivos: Array<{
    id: number;
    nome: string;
    url: string;
  }>;
  curso: {
    id: number;
    titulo: string;
  } | null;
  isToday?: boolean;
  isPast?: boolean;
  isFuture?: boolean;
  isInProgress?: boolean;
  timeDiffMinutes?: number;
  calculatedStatus?: string;
  canJoin?: boolean;
}

interface GoogleUser {
  email: string;
  displayName: string;
  photoURL: string;
  googleId: string;
}

export default function LessonsList() {
  const t = useTranslations("Student");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningLesson, setJoiningLesson] = useState<number | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const pendingLessonRef = useRef<{
    link: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      try {
        const payload = JSON.parse(atob(response.credential.split(".")[1]));

        const user: GoogleUser = {
          email: payload.email,
          displayName: payload.name,
          photoURL: payload.picture,
          googleId: payload.sub,
        };

        setGoogleUser(user);
        localStorage.setItem("googleUser", JSON.stringify(user));

        if (pendingLessonRef.current) {
          redirectToLesson(
            pendingLessonRef.current.link,
            pendingLessonRef.current.id,
            user
          );
          pendingLessonRef.current = null;
        }
      } catch {
        // Handle error silently
      }
    },
    []
  );

  useEffect(() => {
    if (isGoogleLoaded && typeof window !== "undefined" && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        callback: handleCredentialResponse,
      });

      const savedUser = localStorage.getItem("googleUser");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setGoogleUser(parsedUser);
        } catch {
          localStorage.removeItem("googleUser");
        }
      }
    }
  }, [isGoogleLoaded, handleCredentialResponse]);

  const signInWithGoogle = () => {
    if (typeof window !== "undefined" && window.google) {
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "none";
      document.body.appendChild(buttonContainer);

      window.google.accounts.id.renderButton(buttonContainer, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: 200,
      });

      const button = buttonContainer.querySelector(
        'div[role="button"]'
      ) as HTMLElement;
      if (button) {
        button.click();
      }

      setTimeout(() => {
        document.body.removeChild(buttonContainer);
      }, 100);
    }
  };

  const redirectToLesson = async (
    link: string,
    lessonId: number,
    user: GoogleUser
  ) => {
    try {
      let url = link;
      if (!link.startsWith("http://") && !link.startsWith("https://")) {
        url = `https://${link}`;
      }

      const participationData = {
        lessonId,
        action: "join_attempt",
        timestamp: new Date().toISOString(),
        studentId: null,
        studentName: null,
        googleEmail: user.email,
        googleDisplayName: user.displayName,
        googlePhotoURL: user.photoURL,
        googleId: user.googleId,
      };

      try {
        await fetch("/api/student/lesson-participation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(participationData),
        });
      } catch {
        // Handle error silently
      }

      window.open(url, "_blank");
    } catch {
      // Handle error silently
    }
  };

  const signOut = () => {
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setGoogleUser(null);
    localStorage.removeItem("googleUser");
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("/api/student/lessons/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.lessons && Array.isArray(data.lessons)) {
          setLessons(data.lessons);
        } else if (Array.isArray(data)) {
          setLessons(data);
        } else {
          setLessons([]);
        }
      } catch {
        setError("Erro ao carregar aulas");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleJoinLesson = async (link: string, lessonId: number) => {
    if (link) {
      setJoiningLesson(lessonId);

      try {
        if (!googleUser) {
          pendingLessonRef.current = { link, id: lessonId };
          signInWithGoogle();
          setJoiningLesson(null);
          return;
        }

        let url = link;
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
          url = `https://${link}`;
        }

        const participationData = {
          lessonId,
          action: "join_attempt",
          timestamp: new Date().toISOString(),
          studentId: null,
          studentName: null,
          googleEmail: googleUser?.email,
          googleDisplayName: googleUser?.displayName,
          googlePhotoURL: googleUser?.photoURL,
          googleId: googleUser?.googleId,
        };

        try {
          await fetch("/api/student/lesson-participation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(participationData),
          });
        } catch (error) {
          console.error("Error registering lesson participation:", error);
        }

        window.open(url, "_blank");
      } catch {
        // Handle error silently
      } finally {
        setJoiningLesson(null);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLessonDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (lesson: Lesson) => {
    if (lesson.isInProgress) {
      return "bg-green-100 text-green-800";
    }
    if (lesson.calculatedStatus === "CONCLUÍDA") {
      return "bg-gray-100 text-gray-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{t("my_lessons")}</span>
          </CardTitle>
          <CardDescription>{t("lessons_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">{t("loading")}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{t("my_lessons")}</span>
          </CardTitle>
          <CardDescription>{t("lessons_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>{t("my_lessons")}</span>
        </CardTitle>
        <CardDescription>{t("lessons_description")}</CardDescription>

        <div className="mt-4">
          {!isGoogleLoaded ? (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>{t("loading_google_signin")}</span>
            </div>
          ) : googleUser ? (
            <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              {googleUser.photoURL ? (
                <Image
                  src={googleUser.photoURL}
                  alt={googleUser.displayName}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      const initialsDiv = document.createElement("div");
                      initialsDiv.className =
                        "w-6 h-6 rounded-full bg-green-600 text-white text-xs font-medium flex items-center justify-center";
                      initialsDiv.textContent = getInitials(
                        googleUser.displayName
                      );
                      parent.replaceChild(initialsDiv, target);
                    }
                  }}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-medium flex items-center justify-center">
                  {getInitials(googleUser.displayName)}
                </div>
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-green-800">
                  {googleUser.displayName}
                </div>
                <div className="text-xs text-green-600">{googleUser.email}</div>
              </div>
              <button
                onClick={signOut}
                className="text-xs text-green-600 hover:text-green-800"
              >
                {t("sign_out")}
              </button>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {lessons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t("no_lessons")}
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {lesson.curso?.titulo || "Curso não encontrado"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatLessonDate(lesson.data)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      lesson
                    )}`}
                  >
                    {lesson.calculatedStatus || lesson.aula_status}
                  </span>
                </div>

                {lesson.canJoin && lesson.link_aula && (
                  <div className="mb-3">
                    <button
                      onClick={() =>
                        handleJoinLesson(lesson.link_aula, lesson.id)
                      }
                      disabled={joiningLesson === lesson.id}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="h-4 w-4" />
                      <span>
                        {joiningLesson === lesson.id
                          ? "Conectando..."
                          : t("join_lesson")}
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {lesson.arquivos && lesson.arquivos.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t("lesson_files")}:
                    </h4>
                    <div className="space-y-1">
                      {lesson.arquivos.map((arquivo) => (
                        <a
                          key={arquivo.id}
                          href={arquivo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="h-4 w-4" />
                          <span>{arquivo.nome}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
