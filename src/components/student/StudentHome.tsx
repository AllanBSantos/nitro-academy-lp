import { useState } from "react";
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
  TrendingUp,
  Calendar,
  Trophy,
  Award,
  Clock,
  PlayCircle,
  Star,
  Sparkles,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Video,
} from "lucide-react";
import { SpinnerIcon } from "../SpinnerIcon";

const mockUpcomingClasses = [
  {
    id: 1,
    course: "Inteligência Artificial",
    title: "Introdução ao Machine Learning",
    date: "Hoje",
    time: "14:00",
    mentor: "Prof. Carlos Silva",
    isLive: true,
  },
  {
    id: 2,
    course: "Empreendedorismo",
    title: "Validação de Ideias",
    date: "Amanhã",
    time: "15:30",
    mentor: "Prof. Maria Santos",
    isLive: false,
  },
  {
    id: 3,
    course: "Marketing Digital",
    title: "Estratégias de Conteúdo",
    date: "Sexta",
    time: "16:00",
    mentor: "Prof. João Oliveira",
    isLive: false,
  },
];

const mockAchievements = [
  { id: 1, name: "Primeira Aula", icon: "🎯", unlocked: true },
  { id: 2, name: "Projeto Completo", icon: "🚀", unlocked: true },
  { id: 3, name: "Top 10 Ranking", icon: "⭐", unlocked: false },
  { id: 4, name: "Mentor Destaque", icon: "👑", unlocked: false },
];

const mockHomework = [
  {
    id: 1,
    course: "Inteligência Artificial",
    title: "Projeto: Sistema de Recomendação",
    description:
      "Desenvolver um algoritmo básico de recomendação usando Python",
    dueDate: "25 Out 2025",
    daysLeft: 5,
    isUrgent: false,
    status: "pending",
  },
  {
    id: 2,
    course: "Empreendedorismo",
    title: "Canvas do Seu Projeto",
    description: "Preencher o Business Model Canvas da sua ideia de negócio",
    dueDate: "22 Out 2025",
    daysLeft: 2,
    isUrgent: true,
    status: "pending",
  },
  {
    id: 3,
    course: "Marketing Digital",
    title: "Análise de Concorrentes",
    description: "Mapear e analisar 3 concorrentes do seu nicho",
    dueDate: "28 Out 2025",
    daysLeft: 8,
    isUrgent: false,
    status: "pending",
  },
];

const mockCompletedHomework = [
  {
    id: 4,
    course: "Inteligência Artificial",
    title: "Introdução ao Python para IA",
    description: "Exercícios básicos de Python e bibliotecas NumPy",
    submittedDate: "15 Out 2025",
    score: 95,
    maxScore: 100,
    feedback:
      "Excelente trabalho! Código muito bem estruturado e comentado. Continue assim!",
    teacherName: "Prof. Carlos Silva",
  },
  {
    id: 5,
    course: "Empreendedorismo",
    title: "Pesquisa de Mercado",
    description: "Análise do mercado-alvo e personas",
    submittedDate: "12 Out 2025",
    score: 88,
    maxScore: 100,
    feedback:
      "Bom trabalho, mas poderia aprofundar mais na análise quantitativa. As personas ficaram muito boas!",
    teacherName: "Prof. Maria Santos",
  },
  {
    id: 6,
    course: "Marketing Digital",
    title: "Criação de Persona",
    description: "Desenvolvimento de persona detalhada do público-alvo",
    submittedDate: "08 Out 2025",
    score: 100,
    maxScore: 100,
    feedback:
      "Perfeito! Persona muito bem detalhada e com dados relevantes. Trabalho exemplar!",
    teacherName: "Prof. João Oliveira",
  },
];

const mockPastClasses = [
  {
    id: 10,
    course: "Inteligência Artificial",
    title: "Introdução ao Machine Learning",
    date: "18 Out 2025",
    time: "14:00",
    mentor: "Prof. Carlos Silva",
    duration: "50 min",
    completed: true,
  },
  {
    id: 11,
    course: "Empreendedorismo",
    title: "Modelo de Negócios",
    date: "17 Out 2025",
    time: "15:30",
    mentor: "Prof. Maria Santos",
    duration: "50 min",
    completed: true,
  },
  {
    id: 12,
    course: "Marketing Digital",
    title: "Funis de Vendas",
    date: "16 Out 2025",
    time: "16:00",
    mentor: "Prof. João Oliveira",
    duration: "50 min",
    completed: true,
  },
  {
    id: 13,
    course: "Inteligência Artificial",
    title: "Redes Neurais Básicas",
    date: "15 Out 2025",
    time: "14:00",
    mentor: "Prof. Carlos Silva",
    duration: "50 min",
    completed: true,
  },
  {
    id: 14,
    course: "Empreendedorismo",
    title: "Pitch e Apresentação",
    date: "14 Out 2025",
    time: "15:30",
    mentor: "Prof. Maria Santos",
    duration: "50 min",
    completed: true,
  },
];

export function StudentHome() {
  const [spinnersToday] = useState(150);
  const [totalSpinners] = useState(2450);
  const [progress] = useState(68);

  const pendingHomework = mockHomework.filter((hw) => hw.status === "pending");

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl text-gray-900 mb-2">Olá, Aluno! 👋</h1>
        <p className="text-gray-600">
          Continue girando sua jornada de aprendizado
        </p>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="aulas" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 h-auto">
            <TabsTrigger
              value="aulas"
              className="flex items-center gap-2 data-[state=active]:bg-white text-gray-900"
            >
              <Video className="w-4 h-4" />
              Aulas
            </TabsTrigger>
            <TabsTrigger
              value="tarefas"
              className="flex items-center gap-2 data-[state=active]:bg-white text-gray-900"
            >
              <ClipboardList className="w-4 h-4" />
              Tarefas de Casa
              {pendingHomework.length > 0 && (
                <Badge className="ml-1 bg-[#f54a12] text-white border-0 h-5 px-2">
                  {pendingHomework.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Aba Aulas */}
          <TabsContent value="aulas" className="mt-6 space-y-6">
            {/* Próximas Aulas */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-[#599fe9]" />
                  <h2 className="text-xl text-gray-900">Próximas Aulas</h2>
                  <Badge className="ml-auto bg-[#599fe9]/20 text-[#599fe9] border-0">
                    {mockUpcomingClasses.length}
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {mockUpcomingClasses.map((class_, index) => (
                  <motion.div
                    key={class_.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          class_.isLive
                            ? "bg-gradient-to-br from-[#f54a12] to-[#ff6b35]"
                            : "bg-[#599fe9]/10"
                        }`}
                      >
                        <PlayCircle
                          className={`w-6 h-6 ${
                            class_.isLive ? "text-white" : "text-[#599fe9]"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                          {class_.course}
                        </Badge>
                        {class_.isLive && (
                          <Badge className="bg-red-500/20 text-red-500 border-red-500/30 text-xs animate-pulse">
                            AO VIVO
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-gray-900 truncate group-hover:text-[#f54a12] transition-colors">
                        {class_.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {class_.date} às {class_.time}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {class_.mentor}
                        </span>
                      </div>
                    </div>
                    <Button
                      className={`flex-shrink-0 ${
                        class_.isLive
                          ? "bg-gradient-to-r from-[#f54a12] to-[#ff6b35] hover:shadow-lg hover:shadow-[#f54a12]/30"
                          : "bg-[#599fe9] hover:bg-[#4a8ed9]"
                      } text-white`}
                    >
                      {class_.isLive ? "Entrar" : "Detalhes"}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Aulas Realizadas */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl text-gray-900">Aulas Realizadas</h2>
                  <Badge className="ml-auto bg-green-100 text-green-700 border-0">
                    {mockPastClasses.length}
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {mockPastClasses.map((class_, index) => (
                  <motion.div
                    key={class_.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                          {class_.course}
                        </Badge>
                      </div>
                      <h3 className="text-gray-900 truncate">{class_.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {class_.date} às {class_.time}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {class_.duration}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {class_.mentor}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      Ver mais
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Aba Tarefas de Casa */}
          <TabsContent value="tarefas" className="mt-6 space-y-6">
            {/* Tarefas Pendentes */}
            {pendingHomework.length > 0 && (
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm">
                <div className="p-6 border-b border-amber-200/50">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#f54a12]" />
                    <h2 className="text-xl text-gray-900">Tarefas Pendentes</h2>
                    <Badge className="ml-auto bg-[#f54a12] text-white border-0">
                      {pendingHomework.length}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {pendingHomework.map((homework, index) => (
                    <motion.div
                      key={homework.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className={`p-4 rounded-xl border-2 bg-white transition-all hover:shadow-md ${
                        homework.isUrgent
                          ? "border-[#f54a12] hover:border-[#f54a12]/70"
                          : "border-gray-200 hover:border-[#599fe9]/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                              {homework.course}
                            </Badge>
                            {homework.isUrgent && (
                              <div className="flex items-center gap-1 text-[#f54a12] text-xs">
                                <AlertCircle className="w-3 h-3" />
                                <span>Urgente</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-gray-900 mb-1">
                            {homework.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {homework.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span
                              className={`${
                                homework.isUrgent
                                  ? "text-[#f54a12]"
                                  : "text-gray-600"
                              }`}
                            >
                              Entregar até: <strong>{homework.dueDate}</strong>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span
                              className={`${
                                homework.isUrgent
                                  ? "text-[#f54a12]"
                                  : "text-gray-500"
                              }`}
                            >
                              {homework.daysLeft}{" "}
                              {homework.daysLeft === 1 ? "dia" : "dias"}{" "}
                              restantes
                            </span>
                          </div>
                        </div>
                        <Button
                          className={`flex-shrink-0 ${
                            homework.isUrgent
                              ? "bg-gradient-to-r from-[#f54a12] to-[#ff6b35] hover:shadow-lg hover:shadow-[#f54a12]/30"
                              : "bg-[#599fe9] hover:bg-[#4a8ed9]"
                          } text-white`}
                        >
                          Realizar
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tarefas Entregues */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl text-gray-900">Tarefas Entregues</h2>
                  <Badge className="ml-auto bg-green-100 text-green-700 border-0">
                    {mockCompletedHomework.length}
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {mockCompletedHomework.map((homework, index) => (
                  <motion.div
                    key={homework.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/30 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                              {homework.course}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="text-sm">
                                <strong>{homework.score}</strong>/
                                {homework.maxScore}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-gray-900 mb-1">
                            {homework.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {homework.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Entregue em: {homework.submittedDate}</span>
                            <span className="text-gray-400">•</span>
                            <span>{homework.teacherName}</span>
                          </div>
                        </div>
                        <div
                          className={`flex-shrink-0 px-4 py-2 rounded-lg text-center ${
                            homework.score === homework.maxScore
                              ? "bg-green-100"
                              : homework.score >= homework.maxScore * 0.7
                              ? "bg-blue-100"
                              : "bg-amber-100"
                          }`}
                        >
                          <div className="text-2xl">
                            {homework.score === homework.maxScore
                              ? "💯"
                              : homework.score >= homework.maxScore * 0.7
                              ? "👍"
                              : "📚"}
                          </div>
                        </div>
                      </div>

                      {/* Feedback do Professor */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-[#599fe9] mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              Comentário do professor:
                            </p>
                            <p className="text-sm text-gray-700">
                              {homework.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
