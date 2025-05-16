"use client";

import { useEffect, useState } from "react";
import { fetchCourses } from "@/lib/strapi";
import { Users, BarChart2, Menu, X } from "lucide-react";

interface CourseStats {
  courseId: number;
  courseTitle: string;
  studentCount: number;
  totalSpots: number;
  availableSpots: number;
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === process.env.NEXT_PUBLIC_ADMIN_PANEL_KEY) {
      onLogin();
    } else {
      setError("Senha incorreta");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Acesso Administrativo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3B82F6] focus:border-[#3B82F6] text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#3B82F6] text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function StudentsByCourse() {
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const courses = await fetchCourses();

        const maxStudentsPerClass = parseInt(
          process.env.NEXT_PUBLIC_MAX_STUDENTS_PER_CLASS || "10"
        );

        const stats = courses.map((course) => {
          const studentCount = Array.isArray(course.alunos)
            ? course.alunos.length
            : 0;
          const totalSpots = Array.isArray(course.cronograma)
            ? course.cronograma.length * maxStudentsPerClass
            : 0;
          const availableSpots = totalSpots - studentCount;

          return {
            courseId: course.id,
            courseTitle: course.titulo || "",
            studentCount,
            totalSpots,
            availableSpots,
          };
        });

        setCourseStats(stats);
      } catch (err) {
        setError("Erro ao carregar dados dos cursos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Alunos por Curso
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Vagas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alunos Matriculados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vagas Disponíveis
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courseStats.map((course) => (
                <tr key={course.courseId} className="hover:bg-gray-50">
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <AdminLayout />;
}
