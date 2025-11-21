"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "../new-layout/ui/card";
import {
  Users,
  School,
  TrendingUp,
  UserCheck,
  UserX,
  Calendar,
  BookOpen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchEnrollmentBySchool,
  fetchEnrollmentTrend,
  fetchPopularCourses,
  fetchStudentsCount,
  fetchSchoolsCount,
} from "@/lib/strapi";

export function AdminDashboardHome() {
  const t = useTranslations("Admin.dashboard_home");
  const locale = useLocale();
  const [enrollmentBySchool, setEnrollmentBySchool] = useState<
    Array<{ school: string; enrolled: number; notEnrolled: number }>
  >([]);
  const [enrollmentTrend, setEnrollmentTrend] = useState<
    Array<{ month: string; matriculas: number }>
  >([]);
  const [popularCourses, setPopularCourses] = useState<
    Array<{ name: string; students: number; color: string }>
  >([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEnrolled, setTotalEnrolled] = useState(0);
  const [totalNotEnrolled, setTotalNotEnrolled] = useState(0);
  const [enrollmentRate, setEnrollmentRate] = useState(0);
  const [schoolsCount, setSchoolsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Normalizar locale para o formato esperado (pt -> pt-BR, en -> en-US)
        const normalizedLocale =
          locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : locale;

        // Buscar dados em paralelo
        const [
          enrollmentBySchoolData,
          enrollmentTrendData,
          popularCoursesData,
          studentsCount,
          schoolsCountData,
        ] = await Promise.all([
          fetchEnrollmentBySchool(),
          fetchEnrollmentTrend(normalizedLocale),
          fetchPopularCourses(),
          fetchStudentsCount(),
          fetchSchoolsCount(),
        ]);

        setEnrollmentBySchool(enrollmentBySchoolData);
        setEnrollmentTrend(enrollmentTrendData);
        setPopularCourses(popularCoursesData);
        setSchoolsCount(schoolsCountData);

        // Calcular estatísticas gerais
        const total = enrollmentBySchoolData.reduce(
          (acc, school) => acc + school.enrolled + school.notEnrolled,
          0
        );
        const enrolled = enrollmentBySchoolData.reduce(
          (acc, school) => acc + school.enrolled,
          0
        );
        const notEnrolled = enrollmentBySchoolData.reduce(
          (acc, school) => acc + school.notEnrolled,
          0
        );

        // Se não houver dados de escolas, usar contagem total de alunos
        const finalTotalStudents = total > 0 ? total : studentsCount;
        const finalEnrolled = enrolled > 0 ? enrolled : studentsCount;
        const finalNotEnrolled = notEnrolled > 0 ? notEnrolled : 0;

        setTotalStudents(finalTotalStudents);
        setTotalEnrolled(finalEnrolled);
        setTotalNotEnrolled(finalNotEnrolled);
        setEnrollmentRate(
          finalTotalStudents > 0
            ? Math.round((finalEnrolled / finalTotalStudents) * 100)
            : 0
        );
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [locale]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </motion.div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#599fe9]/10 rounded-xl">
                <Users className="w-6 h-6 text-[#599fe9]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#599fe9]" />
            </div>
            <p className="text-gray-600 text-sm mb-1">{t("total_students")}</p>
            <p className="text-4xl text-gray-900 mb-1">{totalStudents}</p>
            <p className="text-xs text-gray-500">{t("registered_in_system")}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">{t("enrolled")}</p>
            <p className="text-4xl text-gray-900 mb-1">{totalEnrolled}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${enrollmentRate}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-green-600">
                {enrollmentRate}%
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <UserX className="w-6 h-6 text-amber-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">{t("not_enrolled")}</p>
            <p className="text-4xl text-gray-900 mb-1">{totalNotEnrolled}</p>
            <p className="text-xs text-gray-500">{t("waiting_enrollment")}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <School className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">{t("partner_schools")}</p>
            <p className="text-4xl text-gray-900 mb-1">
              {schoolsCount > 0 ? schoolsCount : enrollmentBySchool.length}
            </p>
            <p className="text-xs text-gray-500">{t("active_institutions")}</p>
          </Card>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico: Matrículas por Escola */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-[#599fe9]" />
                <h2 className="text-xl text-gray-900">
                  {t("enrollment_by_school.title")}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {t("enrollment_by_school.description")}
              </p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    enrollmentBySchool.length > 0
                      ? enrollmentBySchool
                      : [
                          {
                            school: t("enrollment_by_school.no_data"),
                            enrolled: 0,
                            notEnrolled: 0,
                          },
                        ]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="school"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="enrolled"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    name={t("enrollment_by_school.enrolled")}
                  />
                  <Bar
                    dataKey="notEnrolled"
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                    name={t("enrollment_by_school.not_enrolled")}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Gráfico: Evolução de Matrículas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#599fe9]" />
                <h2 className="text-xl text-gray-900">
                  {t("enrollment_trend.title")}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {t("enrollment_trend.description")}
              </p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={
                    enrollmentTrend.length > 0
                      ? enrollmentTrend
                      : [
                          {
                            month: t("enrollment_trend.no_data"),
                            matriculas: 0,
                          },
                        ]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="matriculas"
                    stroke="#599fe9"
                    strokeWidth={3}
                    dot={{ fill: "#599fe9", r: 5 }}
                    activeDot={{ r: 7 }}
                    name={t("enrollment_trend.enrollments")}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Cursos Mais Populares */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Cursos Mais Populares */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#599fe9]" />
                <h2 className="text-xl text-gray-900">
                  {t("popular_courses.title")}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {t("popular_courses.description")}
              </p>
            </div>
            <div className="p-6 space-y-4">
              {popularCourses.length > 0 ? (
                popularCourses.map((course, index) => (
                  <div key={course.name} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-700">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-900 truncate">
                          {course.name}
                        </h3>
                        <span className="text-sm font-semibold text-gray-700 ml-2">
                          {course.students}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${
                              popularCourses.length > 0 &&
                              popularCourses[0].students > 0
                                ? (course.students /
                                    popularCourses[0].students) *
                                  100
                                : 0
                            }%`,
                            backgroundColor: course.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {t("popular_courses.no_courses")}
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Estatísticas Adicionais - Ocultado temporariamente */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#599fe9]" />
                <h2 className="text-xl text-gray-900">Estatísticas Gerais</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Métricas importantes do mês
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#599fe9]/10 to-[#599fe9]/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#599fe9] rounded-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Média de Alunos/Turma{" "}
                      <span className="text-red-500">*</span>
                    </p>
                    <p className="text-2xl text-gray-900">
                      {mockAdditionalStats.averageStudentsPerClass}
                    </p>
                  </div>
                </div>
                <Badge className="bg-[#599fe9] text-white border-0">+12%</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100/50 to-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Taxa de Conclusão <span className="text-red-500">*</span>
                    </p>
                    <p className="text-2xl text-gray-900">
                      {mockAdditionalStats.completionRate}%
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white border-0">+5%</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100/50 to-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <School className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Novas Parcerias (mês){" "}
                      <span className="text-red-500">*</span>
                    </p>
                    <p className="text-2xl text-gray-900">
                      {mockAdditionalStats.newPartnerships}
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-600 text-white border-0">
                  Novo
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f54a12]/10 to-[#f54a12]/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#f54a12] rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Certificados Emitidos{" "}
                      <span className="text-red-500">*</span>
                    </p>
                    <p className="text-2xl text-gray-900">
                      {mockAdditionalStats.certificatesIssued}
                    </p>
                  </div>
                </div>
                <Badge className="bg-[#f54a12] text-white border-0">+28%</Badge>
              </div>
            </div>
          </Card>
        </motion.div> */}
      </div>
    </div>
  );
}
