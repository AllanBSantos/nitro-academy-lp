"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { CoursesList } from "@/components/admin/CoursesList";
import PartnerStudentsList from "./PartnerStudentsList";
import StudentsReport from "@/components/admin/StudentsReport";
import ExceededStudentsReport from "@/app/components/admin/ExceededStudentsReport";

interface Mentor {
  id: number;
  nome: string;
}

function AdminLayout() {
  const t = useTranslations("Admin.panel");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("courses");
  const [isMentor, setIsMentor] = useState(false);
  const [mentor, setMentor] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verify user role securely from server instead of URL parameters
    const verifyUserRole = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          console.log("No auth token found, redirecting to login");
          router.replace(`/${params.locale}/login`);
          return;
        }

        console.log(
          "Verifying user role with token:",
          token.substring(0, 20) + "..."
        );

        const response = await fetch("/api/auth/verify-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        console.log("Role verification response status:", response.status);
        console.log(
          "Role verification response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to verify user role:", errorData);
          router.replace(`/${params.locale}/login`);
          return;
        }

        const userData = await response.json();
        console.log("User role verified successfully:", userData);

        // Set user role and permissions based on server verification
        if (userData.role.type === "mentor") {
          setIsMentor(true);
          setMentor(
            userData.mentorId ? { id: userData.mentorId, nome: "Mentor" } : null
          );
        } else if (userData.role.type === "student") {
          // Students should not access admin panel
          router.replace(`/${params.locale}/student`);
          return;
        } else if (
          userData.role.type === "admin" ||
          userData.role.type === "authenticated"
        ) {
          // Admin or authenticated users have full access
          setIsMentor(false);
          setMentor(null);
        }
      } catch (error) {
        console.error("Error verifying user role:", error);
        router.replace(`/${params.locale}/login`);
      }
    };

    verifyUserRole();
  }, [router, params.locale]);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    router.push(`/${params.locale}/login`);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "courses":
        return <CoursesList />;
      case "partner-students":
        return <PartnerStudentsList />;
      case "students-report":
        return <StudentsReport />;
      case "exceeded-students-report":
        return <ExceededStudentsReport />;
      default:
        return <CoursesList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between border-b px-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
            {isMentor && mentor && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <User className="h-4 w-4" />
                <span>{mentor.nome}</span>
              </div>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition"
                title={t("logout")}
                aria-label={t("logout")}
              >
                <LogOut className="w-6 h-6 text-red-600" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-44 text-center">
              <div className="mb-2 text-sm text-gray-700">
                {t("logout_confirm")}
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white rounded px-3 py-2 hover:bg-red-600 transition font-semibold"
              >
                {t("logout_action")}
              </button>
            </PopoverContent>
          </Popover>
        </div>

        <nav className="flex-1 space-y-2 mt-8">
          <button
            onClick={() => setActiveMenu("courses")}
            className={`w-full flex items-center justify-start px-4 py-2 text-sm font-medium rounded-md transition-colors text-left ${
              activeMenu === "courses"
                ? "bg-[#3B82F6] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="whitespace-nowrap">
              {isMentor ? "Meus Cursos" : t("courses")}
            </span>
          </button>
          {!isMentor && (
            <>
              <button
                onClick={() => setActiveMenu("partner-students")}
                className={`w-full flex items-center justify-start px-4 py-2 text-sm font-medium rounded-md transition-colors text-left ${
                  activeMenu === "partner-students"
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="whitespace-nowrap">
                  {t("partner_students")}
                </span>
              </button>
              <button
                onClick={() => setActiveMenu("students-report")}
                className={`w-full flex items-center justify-start px-4 py-2 text-sm font-medium rounded-md transition-colors text-left ${
                  activeMenu === "students-report"
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="whitespace-nowrap">
                  {t("students_report")}
                </span>
              </button>
              <button
                onClick={() => setActiveMenu("exceeded-students-report")}
                className={`w-full flex items-center justify-start px-4 py-2 text-sm font-medium rounded-md transition-colors text-left ${
                  activeMenu === "exceeded-students-report"
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="whitespace-nowrap">Alunos Excedentes</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={`min-h-screen transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return <AdminLayout />;
}
