"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { LogOut, BookOpen, User, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

interface Student {
  id: number;
  nome: string;
  cursos: Array<{
    id: number;
    titulo: string;
    documentId: string;
  }>;
}

export default function StudentDashboard() {
  const t = useTranslations("Student");
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          router.replace(`/${params.locale}/login`);
          return;
        }

        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
        if (!STRAPI_URL) {
          throw new Error(
            "NEXT_PUBLIC_STRAPI_URL environment variable is not set"
          );
        }

        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.student) {
            // Fetch student details
            const studentRes = await fetch(
              `${STRAPI_URL}/api/alunos/${userData.student}?populate[cursos][populate]=*`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (studentRes.ok) {
              const studentData = await studentRes.json();
              setStudent(studentData.data);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [router, params.locale]);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    router.push(`/${params.locale}/login`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Erro ao carregar dados do estudante</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t("dashboard_title")}
                </h1>
                <p className="text-sm text-gray-600">
                  {t("welcome")}, {student.nome}!
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t("personal_info")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">{t("name")}:</span>{" "}
                  {student.nome}
                </div>
                <div>
                  <span className="font-medium">{t("id")}:</span> {student.id}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{t("my_courses")}</span>
              </CardTitle>
              <CardDescription>{t("enrolled_courses")}</CardDescription>
            </CardHeader>
            <CardContent>
              {student.cursos && student.cursos.length > 0 ? (
                <div className="space-y-2">
                  {student.cursos.map((curso) => (
                    <div
                      key={curso.id}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="font-medium text-blue-900">
                        {curso.titulo}
                      </div>
                      <div className="text-sm text-blue-700">
                        ID: {curso.documentId}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  {t("no_courses")}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{t("quick_actions")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                  <div className="font-medium text-green-900">
                    {t("view_schedules")}
                  </div>
                  <div className="text-sm text-green-700">
                    {t("view_schedules_desc")}
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                  <div className="font-medium text-purple-900">
                    {t("materials")}
                  </div>
                  <div className="text-sm text-purple-700">
                    {t("materials_desc")}
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
