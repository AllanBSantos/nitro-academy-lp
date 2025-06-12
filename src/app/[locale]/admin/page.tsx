"use client";

import { useState } from "react";
import { Users, BarChart2, Menu, X } from "lucide-react";
import { StudentsByCourse } from "@/app/components/admin/StudentsByCourse";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("students");

  const menuItems = [
    {
      id: "students",
      label: "Alunos por Curso",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart2 className="w-5 h-5" />,
    },
  ];

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
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
                activeMenu === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={`min-h-screen transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <div className="p-8">
          {activeMenu === "students" && <StudentsByCourse />}
          {activeMenu === "dashboard" && (
            <div className="text-center text-gray-500">
              Dashboard em desenvolvimento
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return <AdminLayout />;
}
