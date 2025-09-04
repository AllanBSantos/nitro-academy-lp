"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Cookies from "js-cookie";

interface CourseStats {
  courseId: number;
  courseTitle: string;
  documentId: string;
  studentCount: number;
  totalSpots: number;
  availableSpots: number;
}

interface Course {
  id: number;
  titulo: string;
  documentId: string;
  alunos: unknown[];
  cronograma: unknown[];
}

export function CoursesList() {
  const t = useTranslations("Admin.panel.courses_list");
  const router = useRouter();
  const params = useParams();
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type SortOption = "alphabetical" | "enrolled";
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          setError("Token de autenticação não encontrado");
          setLoading(false);
          return;
        }

        // Use secure filtered courses API
        const response = await fetch("/api/courses/filtered", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Check if mentor needs identification
          if (response.status === 403 && errorData.needsIdentification) {
            router.replace(`/${params.locale}/identify`);
            return;
          }

          setError(errorData.error || "Erro ao carregar cursos");
          setLoading(false);
          return;
        }

        const data = await response.json();

        const maxStudentsPerClass = parseInt(
          process.env.NEXT_PUBLIC_MAX_STUDENTS_PER_CLASS || "10"
        );

        const stats = data.courses.map((course: Course) => {
          const studentCount = Array.isArray(course.alunos)
            ? course.alunos.length
            : 0;
          const totalSpots = Array.isArray(course.cronograma)
            ? course.cronograma.length * maxStudentsPerClass
            : 0;
          const availableSpots = Math.max(0, totalSpots - studentCount);

          return {
            courseId: course.id,
            courseTitle: course.titulo || "",
            documentId: course.documentId || "",
            studentCount,
            totalSpots,
            availableSpots,
          };
        });

        setCourseStats(stats);
      } catch (err) {
        setError(t("error"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [t, params.locale, router]);

  const handleCourseClick = (courseId: number, documentId: string) => {
    router.push(`/${params.locale}/admin/courses/${documentId}`);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const sortedCourseStats = [...courseStats].sort((a, b) => {
    if (sortOption === "alphabetical") {
      return a.courseTitle.localeCompare(b.courseTitle, undefined, {
        sensitivity: "base",
      });
    }
    // Default to sort by enrolled students (desc)
    return b.studentCount - a.studentCount;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const title = t("title");
    doc.setFontSize(16);
    doc.text(title, 14, 18);

    const head = [
      [
        t("table.course_name"),
        t("table.total_spots"),
        t("table.enrolled_students"),
        t("table.available_spots"),
      ],
    ];
    const body = sortedCourseStats.map((c) => [
      c.courseTitle,
      String(c.totalSpots),
      String(c.studentCount),
      String(c.availableSpots),
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 24,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
      theme: "striped",
      columnStyles: {
        0: { cellWidth: 90 },
      },
    });

    const date = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    doc.save(`cursos-${date}.pdf`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t("title")}</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-4 border-b">
          <Button
            type="button"
            variant="secondary"
            onClick={handleExportPDF}
            className="gap-2 text-gray-900"
          >
            <Download className="h-4 w-4" /> {t("actions.export_pdf")}
          </Button>
          <span className="text-sm text-gray-600">{t("sort.label")}</span>
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
            <SelectTrigger className="w-64 text-gray-900 data-[placeholder]:text-gray-500">
              <SelectValue placeholder={t("sort.label")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">
                {t("sort.alphabetical")}
              </SelectItem>
              <SelectItem value="enrolled">
                {t("sort.enrolled_desc")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("table.course_name")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("table.total_spots")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("table.enrolled_students")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("table.available_spots")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCourseStats.map((course) => (
                <tr
                  key={course.courseId}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() =>
                    handleCourseClick(course.courseId, course.documentId)
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.courseTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.totalSpots}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.studentCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.availableSpots < 7
                          ? "bg-red-100 text-red-800"
                          : course.availableSpots < 15
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {course.availableSpots}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
