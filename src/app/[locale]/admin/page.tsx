"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { CoursesList } from "@/components/admin/CoursesList";
import PartnerStudentsList from "./PartnerStudentsList";
import ExceededStudentsReport from "@/app/components/admin/ExceededStudentsReport";
import AllStudentsList from "@/app/components/admin/AllStudentsList";

function AdminLayout() {
  const t = useTranslations("Admin.panel");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("courses");
  const [isMentor, setIsMentor] = useState(false);
  const [mentor, setMentor] = useState<{ id: number; nome: string } | null>(
    null
  );
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Verify user role securely from server instead of URL parameters
    const verifyUserRole = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          router.replace(`/${params.locale}/login`);
          return;
        }

        const response = await fetch("/api/auth/verify-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to verify user role:", errorData);
          router.replace(`/${params.locale}/login`);
          return;
        }

        const userData = await response.json();

        // Set user role and permissions based on server verification
        if (userData.role.type === "mentor") {
          if (userData.mentorId) {
            // Mentor is linked, allow access
            setIsMentor(true);
            setMentor(
              userData.mentorId
                ? { id: userData.mentorId, nome: "Mentor" }
                : null
            );
          } else {
            // Mentor role but not linked, this should not happen
            console.error("CRITICAL ERROR: Mentor not linked in admin page", {
              timestamp: new Date().toISOString(),
              userData,
              environment: process.env.NODE_ENV,
            });
            // Instead of redirecting, show error or handle appropriately
            router.replace(`/${params.locale}/login`);
            return;
          }
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
        } else {
          // No specific role, this should not happen
          console.error("CRITICAL ERROR: No specific role in admin page", {
            timestamp: new Date().toISOString(),
            userData,
            environment: process.env.NODE_ENV,
          });
          // Instead of redirecting, show error or handle appropriately
          router.replace(`/${params.locale}/login`);
          return;
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
        return <AllStudentsList />;
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
