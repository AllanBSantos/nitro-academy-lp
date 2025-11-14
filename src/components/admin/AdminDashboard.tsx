import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Home,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { AdminHome } from "./AdminHome";
import { AdminCourses } from "./AdminCourses";
import { AdminStudents } from "./AdminStudents";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../new-layout/ui/tooltip";
// import logoImage from "/pt/logo_nitro_transparente.png";

type TabType = "home" | "courses" | "students";

export function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial tab from URL or default to "home"
  const getInitialTab = (): TabType => {
    const tab = searchParams.get("tab") as TabType;
    return tab && ["home", "courses", "students"].includes(tab) ? tab : "home";
  };

  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Sync state with URL on mount and when URL changes
  useEffect(() => {
    const tab = getInitialTab();
    setActiveTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleLogout = () => {
    window.location.hash = "";
  };

  const menuItems = [
    { id: "home" as TabType, label: "Home", icon: Home },
    { id: "courses" as TabType, label: "Cursos", icon: BookOpen },
    { id: "students" as TabType, label: "Alunos", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <TooltipProvider>
        {/* Sidebar for Desktop */}
        <aside
          className={`hidden lg:flex fixed left-0 top-0 h-screen bg-[#19184b] border-r border-white/10 flex-col transition-all duration-300 ${
            sidebarCollapsed ? "w-20" : "w-72"
          }`}
        >
          {/* Logo */}
          <div
            className={`border-b border-white/5 transition-all duration-300 ${
              sidebarCollapsed ? "p-4" : "p-8"
            }`}
          >
            {!sidebarCollapsed && (
              <div>
                <Image
                  src="/pt/logo_nitro_transparente.png"
                  alt="Nitro Academy"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
                <p className="mt-2 text-white/40 text-sm">
                  Painel Administrativo
                </p>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-[#f54a12] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <div className="p-4 border-b border-white/5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all ${
                    sidebarCollapsed ? "justify-center" : ""
                  }`}
                >
                  {sidebarCollapsed ? (
                    <ChevronsRight className="w-5 h-5" />
                  ) : (
                    <>
                      <ChevronsLeft className="w-5 h-5" />
                      <span>Recolher Menu</span>
                    </>
                  )}
                </button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  <p>Expandir</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#f54a12] text-white shadow-lg shadow-[#f54a12]/20"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        } ${sidebarCollapsed ? "justify-center" : ""}`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </button>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all ${
                    sidebarCollapsed ? "justify-center" : ""
                  }`}
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>Sair</span>}
                </button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  <p>Sair</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`lg:hidden fixed left-0 top-0 h-screen w-72 bg-[#19184b] border-r border-white/10 flex-col z-50 transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div>
              <Image
                src="/pt/logo_nitro_transparente.png"
                alt="Nitro Academy"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
              <p className="mt-2 text-white/40 text-sm">
                Painel Administrativo
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#f54a12] text-white shadow-lg shadow-[#f54a12]/20"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`min-h-screen bg-[#f5f7fa] transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
          }`}
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-[#19184b] border-b border-white/10">
            <div className="px-6 lg:px-12 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-white/60 hover:text-white"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl text-white">
                    {activeTab === "home"
                      ? "Home"
                      : activeTab === "courses"
                      ? "Cursos"
                      : "Alunos"}
                  </h1>
                  <p className="text-white/40 text-sm mt-1">
                    {activeTab === "home"
                      ? "Visão geral de suas aulas e tarefas"
                      : activeTab === "courses"
                      ? "Gerencie os cursos e matrículas"
                      : "Visualize e exporte dados dos alunos"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-6 lg:px-12 py-8 bg-[#f5f7fa]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "home" && <AdminHome />}
              {activeTab === "courses" && <AdminCourses />}
              {activeTab === "students" && <AdminStudents />}
            </motion.div>
          </div>
        </main>
      </TooltipProvider>
    </div>
  );
}
