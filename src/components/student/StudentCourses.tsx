import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Progress } from "../new-layout/ui/progress";
import { Badge } from "../new-layout/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../new-layout/ui/tabs";
import {
  BookOpen,
  Play,
  Trophy,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";
import { fetchStudentCoursesWithProgress } from "@/lib/strapi";

type Course = {
  id: number;
  name: string;
  mentor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  spinners: number;
  image: string;
  status: "active" | "completed" | "locked";
  nextLesson: string | null;
};

export function StudentCourses() {
  const [activeTab, setActiveTab] = useState("active");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const data = await fetchStudentCoursesWithProgress();
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

  const filteredCourses = courses.filter((course) =>
    activeTab === "all" ? true : course.status === activeTab
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f54a12] mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl text-gray-900 mb-2">Meus Cursos</h1>
        <p className="text-gray-600">Acompanhe seu progresso em cada curso</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-white"
            >
              Em Andamento
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-white"
            >
              Concluídos
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              Todos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              {/* Course Image */}
              <div className="relative h-40 overflow-hidden bg-gray-200">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {course.status === "completed" && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-emerald-500 text-white rounded-full p-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                )}
                {course.status === "active" && (
                  <Badge className="absolute top-4 left-4 bg-[#f54a12] text-white border-0">
                    Em Progresso
                  </Badge>
                )}
              </div>

              {/* Course Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl text-gray-900 mb-1 group-hover:text-[#f54a12] transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600">{course.mentor}</p>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progresso</span>
                    <span className="text-gray-900">{course.progress}%</span>
                  </div>
                  <Progress
                    value={course.progress}
                    className="h-2 bg-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {course.completedLessons} de {course.totalLessons} aulas
                    concluídas
                  </p>
                </div>

                {/* Actions */}
                {course.status === "active" ? (
                  <div className="space-y-2">
                    {course.nextLesson && (
                      <p className="text-xs text-gray-600 mb-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Próxima: {course.nextLesson}
                      </p>
                    )}
                    <Button className="w-full bg-gradient-to-r from-[#f54a12] to-[#ff6b35] hover:shadow-lg hover:shadow-[#f54a12]/30 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Continuar Curso
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-500 mb-2">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm">Curso Concluído!</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-[#599fe9] text-[#599fe9] hover:bg-[#599fe9] hover:text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Revisar Conteúdo
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
