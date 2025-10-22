import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  BookOpen,
  Trophy,
  Award,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Users,
  ShoppingBag,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../new-layout/ui/avatar";
import { Badge } from "../new-layout/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../new-layout/ui/tooltip";
import { StudentHome } from "./StudentHome";
import { StudentCourses } from "./StudentCourses";
import { StudentAchievements } from "./StudentAchievements";
import { StudentCertificates } from "./StudentCertificates";
import { StudentMessages } from "./StudentMessages";
import { StudentProfile } from "./StudentProfile";
import { StudentRanking } from "./StudentRanking";
import { StudentLessons } from "./StudentLessons";
import { StudentStore } from "./StudentStore";
// import logoImage from "/pt/logo_nitro_transparente.png";
import { SpinnerIcon } from "../SpinnerIcon";

type TabType =
  | "home"
  | "courses"
  | "achievements"
  | "certificates"
  | "messages"
  | "ranking"
  | "store"
  | "profile";

interface LessonView {
  courseId: number;
  courseName: string;
}

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonsView, setLessonsView] = useState<LessonView | null>(null);

  const studentData = {
    name: "Lucas Silva",
    spinners: 2450,
    level: 5,
    unreadMessages: 3,
  };

  const handleLogout = () => {
    window.location.hash = "";
  };

  const handleViewLessons = (courseId: number, courseName: string) => {
    setLessonsView({ courseId, courseName });
  };

  const handleBackFromLessons = () => {
    setLessonsView(null);
  };

  const menuItems = [
    { id: "home" as TabType, label: "Início", icon: Home },
    { id: "courses" as TabType, label: "Meus Cursos", icon: BookOpen },
    { id: "achievements" as TabType, label: "Conquistas", icon: Trophy },
    { id: "certificates" as TabType, label: "Certificados", icon: Award },
    { id: "ranking" as TabType, label: "Ranking", icon: TrendingUp },
    { id: "store" as TabType, label: "Loja", icon: ShoppingBag },
    {
      id: "messages" as TabType,
      label: "Mensagens",
      icon: MessageCircle,
      badge: studentData.unreadMessages,
    },
    { id: "profile" as TabType, label: "Perfil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <TooltipProvider>
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-[#19184b] border-r border-white/10 flex-col">
          {/* Logo & User Info */}
          <div className="p-6 border-b border-white/5">
            <img
              src="/pt/logo_nitro_transparente.png"
              alt="Nitro Academy"
              className="h-10 w-auto mb-6"
            />

            {/* User Card */}
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12 border-2 border-white/20">
                  <AvatarFallback className="bg-gradient-to-br from-[#599fe9] to-[#4a8ed9] text-white">
                    {studentData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white truncate">{studentData.name}</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs mt-1">
                    Nível {studentData.level}
                  </Badge>
                </div>
              </div>

              {/* Spinners Display */}
              <div className="flex items-center justify-between p-2 bg-gradient-to-r from-[#f54a12]/20 to-[#ff6b35]/20 rounded-lg border border-[#f54a12]/30">
                <div className="flex items-center gap-2">
                  <SpinnerIcon className="w-5 h-5 text-amber-400" />
                  <span className="text-white text-sm">
                    {studentData.spinners}
                  </span>
                </div>
                <span className="text-white/60 text-xs">Spinners</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setLessonsView(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                      isActive
                        ? "bg-gradient-to-r from-[#f54a12] to-[#ff6b35] text-white shadow-lg shadow-[#f54a12]/20"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge className="ml-auto bg-[#f54a12] text-white border-0 text-xs h-5 min-w-5 px-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-2 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setSidebarOpen(false)}
              />

              <motion.aside
                initial={{ x: -288 }}
                animate={{ x: 0 }}
                exit={{ x: -288 }}
                transition={{ type: "spring", damping: 25 }}
                className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-[#19184b] border-r border-white/10 flex flex-col z-50"
              >
                {/* Logo & User Info */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <img
                      src="/pt/logo_nitro_transparente.png"
                      alt="Nitro Academy"
                      className="h-10 w-auto"
                    />
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* User Card */}
                  <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12 border-2 border-white/20">
                        <AvatarFallback className="bg-gradient-to-br from-[#599fe9] to-[#4a8ed9] text-white">
                          {studentData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white truncate">
                          {studentData.name}
                        </h3>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs mt-1">
                          Nível {studentData.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Spinners Display */}
                    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-[#f54a12]/20 to-[#ff6b35]/20 rounded-lg border border-[#f54a12]/30">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-white text-sm">
                          {studentData.spinners}
                        </span>
                      </div>
                      <span className="text-white/60 text-xs">Spinners</span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setLessonsView(null);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                            isActive
                              ? "bg-gradient-to-r from-[#f54a12] to-[#ff6b35] text-white shadow-lg shadow-[#f54a12]/20"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span>{item.label}</span>
                          {item.badge && item.badge > 0 && (
                            <Badge className="ml-auto bg-[#f54a12] text-white border-0 text-xs h-5 min-w-5 px-1.5">
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span>Sair</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="lg:ml-72 min-h-screen">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-30 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <img
                src="/pt/logo_nitro_transparente.png"
                alt="Nitro Academy"
                className="h-8 w-auto"
              />
              <div className="flex items-center gap-2">
                <SpinnerIcon className="w-5 h-5 text-amber-500" />
                <span className="text-gray-900">{studentData.spinners}</span>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {lessonsView ? (
                <StudentLessons
                  key="lessons"
                  courseId={lessonsView.courseId}
                  courseName={lessonsView.courseName}
                  onBack={handleBackFromLessons}
                />
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "home" && <StudentHome />}
                  {activeTab === "courses" && <StudentCourses />}
                  {activeTab === "achievements" && <StudentAchievements />}
                  {activeTab === "certificates" && <StudentCertificates />}
                  {activeTab === "messages" && <StudentMessages />}
                  {activeTab === "ranking" && <StudentRanking />}
                  {activeTab === "store" && <StudentStore />}
                  {activeTab === "profile" && <StudentProfile />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </TooltipProvider>
    </div>
  );
}
