"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { CoursesList } from "@/components/admin/CoursesList";
import PartnerStudentsList from "./PartnerStudentsList";
import StudentsReport from "@/components/admin/StudentsReport";

function AdminLayout() {
  const t = useTranslations("Admin.panel");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("courses");
  const router = useRouter();
  const params = useParams();

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
          <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
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
            <span className="whitespace-nowrap">{t("courses")}</span>
          </button>
          <button
            onClick={() => setActiveMenu("partner-students")}
            className={`w-full flex items-center justify-start px-4 py-2 text-sm font-medium rounded-md transition-colors text-left ${
              activeMenu === "partner-students"
                ? "bg-[#3B82F6] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="whitespace-nowrap">{t("partner_students")}</span>
          </button>
          <button
            onClick={() => setActiveMenu("students-report")}
            className={`w-full flex items-center justify-start px-4 py-2 text-sm font-medium rounded-md transition-colors text-left ${
              activeMenu === "students-report"
                ? "bg-[#3B82F6] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="whitespace-nowrap">{t("students_report")}</span>
          </button>
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
