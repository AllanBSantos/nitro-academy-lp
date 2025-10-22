import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../new-layout/ui/select";
import { Card } from "../new-layout/ui/card";
import { Badge } from "../new-layout/ui/badge";
import {
  Users,
  GraduationCap,
  TrendingUp,
  Filter,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";
import { Progress } from "../new-layout/ui/progress";
import { CourseDetails } from "./CourseDetails";
import { fetchCoursesWithEnrollment } from "@/lib/strapi";

type Course = {
  id: string;
  name: string;
  campaign: string;
  enrolled: number;
  available: number;
  total: number;
};

export function AdminCourses() {
  const [selectedCampaign, setSelectedCampaign] = useState("Todas");
  const [sortBy, setSortBy] = useState<"name" | "enrolled">("name");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const data = await fetchCoursesWithEnrollment();
        setCourses(data);
      } catch (err) {
        setError("Erro ao carregar cursos");
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  // Extrair campanhas únicas dos cursos
  const campaigns = [
    "Todas",
    ...Array.from(new Set(courses.map((course) => course.campaign))),
  ];

  const filteredCourses = courses
    .filter(
      (course) =>
        selectedCampaign === "Todas" || course.campaign === selectedCampaign
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return b.enrolled - a.enrolled;
    });

  const totalEnrolled = filteredCourses.reduce(
    (acc, course) => acc + course.enrolled,
    0
  );
  const totalAvailable = filteredCourses.reduce(
    (acc, course) => acc + course.available,
    0
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f54a12] mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // If a course is selected, show details
  if (selectedCourse) {
    return (
      <CourseDetails
        course={{
          id: parseInt(selectedCourse.id),
          name: selectedCourse.name,
          campaign: selectedCourse.campaign,
          students: selectedCourse.enrolled,
          totalSlots: selectedCourse.total,
        }}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[#f54a12]/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-[#f54a12]" />
              </div>
              <TrendingUp className="w-4 h-4 text-[#f54a12]" />
            </div>
            <p className="text-gray-600 text-xs mb-1">Total de Cursos</p>
            <p className="text-3xl text-gray-900">{filteredCourses.length}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[#599fe9]/10 rounded-lg">
                <Users className="w-5 h-5 text-[#599fe9]" />
              </div>
              <TrendingUp className="w-4 h-4 text-[#599fe9]" />
            </div>
            <p className="text-gray-600 text-xs mb-1">Alunos Matriculados</p>
            <p className="text-3xl text-gray-900">{totalEnrolled}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <GraduationCap className="w-5 h-5 text-emerald-500" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-gray-600 text-xs mb-1">Vagas Disponíveis</p>
            <p className="text-3xl text-gray-900">{totalAvailable}</p>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-[#599fe9]" />
                <label className="text-gray-700 text-sm">
                  Filtrar por Campanha
                </label>
              </div>
              <Select
                value={selectedCampaign}
                onValueChange={setSelectedCampaign}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg hover:bg-gray-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign} value={campaign}>
                      {campaign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpDown className="w-4 h-4 text-[#599fe9]" />
                <label className="text-gray-700 text-sm">Ordenar por</label>
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: "name" | "enrolled") => setSortBy(value)}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg hover:bg-gray-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Ordem Alfabética</SelectItem>
                  <SelectItem value="enrolled">
                    Número de Matriculados
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCourses.map((course, index) => {
          const occupancyPercentage = (course.enrolled / course.total) * 100;
          const isAlmostFull = occupancyPercentage >= 80;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => setSelectedCourse(course)}
            >
              <Card className="bg-white border-gray-200 p-4 hover:border-gray-300 hover:shadow-md transition-all group shadow-sm cursor-pointer">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-900 mb-1.5 group-hover:text-[#f54a12] transition-colors">
                      {course.name}
                    </h3>
                    <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                      {course.campaign}
                    </Badge>
                  </div>
                  {isAlmostFull && (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                      Quase Lotado
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="w-3.5 h-3.5 text-[#599fe9]" />
                      <span className="text-gray-600 text-xs">
                        Matriculados
                      </span>
                    </div>
                    <p className="text-2xl text-gray-900">{course.enrolled}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-gray-600 text-xs">Vagas</span>
                    </div>
                    <p className="text-2xl text-emerald-500">
                      {course.available}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Ocupação do Curso</span>
                    <span className="text-gray-900">
                      {Math.round(occupancyPercentage)}%
                    </span>
                  </div>
                  <Progress
                    value={occupancyPercentage}
                    className="h-1.5 bg-gray-200"
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <Card className="bg-white border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-600 text-lg">
            Nenhum curso encontrado para esta campanha.
          </p>
        </Card>
      )}
    </div>
  );
}
