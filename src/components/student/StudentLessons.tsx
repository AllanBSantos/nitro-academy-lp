import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../new-layout/ui/tabs";
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  Lock,
  Calendar,
  Clock,
  FileText,
  Download,
  MessageSquare,
  ExternalLink,
  Star
} from "lucide-react";
import { Progress } from "../new-layout/ui/progress";

interface StudentLessonsProps {
  courseId: number;
  courseName: string;
  onBack: () => void;
}

const mockLessons = [
  {
    id: 1,
    title: "Introdução ao Curso",
    date: "10/10/2024",
    time: "14:00",
    duration: "50min",
    status: "completed",
    spinners: 50,
    liveLink: "https://meet.google.com/abc-defg-hij",
    materials: ["Slides.pdf", "Material Complementar.pdf"],
  },
  {
    id: 2,
    title: "Fundamentos de IA",
    date: "12/10/2024",
    time: "14:00",
    duration: "50min",
    status: "completed",
    spinners: 50,
    liveLink: "https://meet.google.com/abc-defg-hij",
    materials: ["Apostila IA.pdf"],
  },
  {
    id: 3,
    title: "Machine Learning Básico",
    date: "Hoje",
    time: "14:00",
    duration: "50min",
    status: "live",
    spinners: 50,
    liveLink: "https://meet.google.com/abc-defg-hij",
    materials: [],
  },
  {
    id: 4,
    title: "Redes Neurais",
    date: "17/10/2024",
    time: "14:00",
    duration: "50min",
    status: "upcoming",
    spinners: 50,
    liveLink: "https://meet.google.com/abc-defg-hij",
    materials: [],
  },
  {
    id: 5,
    title: "Processamento de Linguagem Natural",
    date: "19/10/2024",
    time: "14:00",
    duration: "50min",
    status: "locked",
    spinners: 50,
    liveLink: "",
    materials: [],
  },
];

const mockProjects = [
  {
    id: 1,
    title: "Chatbot com IA",
    description: "Desenvolva um chatbot inteligente usando técnicas de NLP",
    status: "in_progress",
    dueDate: "25/10/2024",
    spinners: 200,
  },
  {
    id: 2,
    title: "Classificador de Imagens",
    description: "Crie um modelo de classificação de imagens com ML",
    status: "not_started",
    dueDate: "05/11/2024",
    spinners: 300,
  },
];

export function StudentLessons({ courseId, courseName, onBack }: StudentLessonsProps) {
  const [activeTab, setActiveTab] = useState("lessons");
  
  const completedLessons = mockLessons.filter(l => l.status === "completed").length;
  const totalLessons = mockLessons.length;
  const progress = Math.round((completedLessons / totalLessons) * 100);
  const earnedSpinners = completedLessons * 50;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-11 px-4 mt-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl text-gray-900 mb-2">{courseName}</h1>
          <p className="text-gray-600">Acompanhe suas aulas e projetos</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[#599fe9]/10 rounded-lg">
                <PlayCircle className="w-5 h-5 text-[#599fe9]" />
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-1">Aulas Concluídas</p>
            <p className="text-3xl text-gray-900">{completedLessons}/{totalLessons}</p>
            <Progress value={progress} className="h-1.5 mt-3 bg-gray-200" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-[#f54a12] to-[#ff6b35] border-0 p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-white drop-shadow-lg fill-white" />
              <div>
                <p className="text-white/90 text-xs">Spinners Ganhos</p>
                <p className="text-3xl text-white">{earnedSpinners}</p>
              </div>
            </div>
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
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-1">Progresso</p>
            <p className="text-3xl text-gray-900">{progress}%</p>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="lessons" className="data-[state=active]:bg-white">
              Aulas
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-white">
              Projetos
            </TabsTrigger>
            <TabsTrigger value="materials" className="data-[state=active]:bg-white">
              Materiais
            </TabsTrigger>
          </TabsList>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="mt-6">
            <div className="space-y-4">
              {mockLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <Card className={`border-2 transition-all hover:shadow-lg ${
                    lesson.status === "live"
                      ? "border-red-300 bg-gradient-to-r from-red-50 to-orange-50"
                      : lesson.status === "completed"
                      ? "border-emerald-200 bg-emerald-50/30"
                      : lesson.status === "locked"
                      ? "border-gray-200 bg-gray-50 opacity-60"
                      : "border-gray-200 bg-white"
                  }`}>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            lesson.status === "completed"
                              ? "bg-emerald-500 text-white"
                              : lesson.status === "live"
                              ? "bg-gradient-to-br from-[#f54a12] to-[#ff6b35] text-white"
                              : lesson.status === "locked"
                              ? "bg-gray-300 text-gray-600"
                              : "bg-[#599fe9] text-white"
                          }`}>
                            {lesson.status === "completed" ? (
                              <CheckCircle2 className="w-7 h-7" />
                            ) : lesson.status === "locked" ? (
                              <Lock className="w-6 h-6" />
                            ) : (
                              <PlayCircle className="w-7 h-7" />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <h3 className="text-xl text-gray-900 mb-1">{lesson.title}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{lesson.date}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{lesson.time} ({lesson.duration})</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.status === "live" && (
                                <Badge className="bg-red-500 text-white border-0 animate-pulse">
                                  AO VIVO
                                </Badge>
                              )}
                              {lesson.status === "completed" && (
                                <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-emerald-600" />
                                  +{lesson.spinners}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Materials */}
                          {lesson.materials.length > 0 && (
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              <FileText className="w-4 h-4 text-gray-400" />
                              {lesson.materials.map((material, i) => (
                                <button
                                  key={i}
                                  className="text-xs text-[#599fe9] hover:underline flex items-center gap-1"
                                >
                                  <Download className="w-3 h-3" />
                                  {material}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          {lesson.status !== "locked" && (
                            <div className="flex items-center gap-2 mt-4">
                              {lesson.status === "live" || lesson.status === "upcoming" ? (
                                <Button 
                                  className={`${
                                    lesson.status === "live"
                                      ? "bg-gradient-to-r from-[#f54a12] to-[#ff6b35] hover:shadow-lg"
                                      : "bg-[#599fe9] hover:bg-[#4a8ed9]"
                                  } text-white`}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {lesson.status === "live" ? "Entrar na Aula" : "Ver Detalhes"}
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline"
                                  className="border-[#599fe9] text-[#599fe9] hover:bg-[#599fe9] hover:text-white"
                                >
                                  <PlayCircle className="w-4 h-4 mr-2" />
                                  Revisar Aula
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <div className="space-y-4">
              {mockProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="bg-white border-gray-200 hover:shadow-lg transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-gray-600 mb-3">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Prazo: {project.dueDate}</span>
                            </div>
                            <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-600" />
                              +{project.spinners}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={
                          project.status === "in_progress"
                            ? "bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30"
                            : "bg-gray-200 text-gray-700 border-gray-300"
                        }>
                          {project.status === "in_progress" ? "Em Andamento" : "Não Iniciado"}
                        </Badge>
                      </div>
                      <Button className="bg-gradient-to-r from-[#f54a12] to-[#ff6b35] text-white hover:shadow-lg">
                        {project.status === "in_progress" ? "Continuar Projeto" : "Iniciar Projeto"}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="mt-6">
            <Card className="bg-white border-gray-200">
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl text-gray-600 mb-2">Materiais Complementares</h3>
                <p className="text-gray-500">
                  Os materiais estarão disponíveis conforme as aulas forem realizadas
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
