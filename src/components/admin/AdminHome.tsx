import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../new-layout/ui/tabs";
import {
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle,
  ClipboardList,
  AlertCircle,
  MessageSquare,
  Video,
  Star,
  Edit,
} from "lucide-react";

const mockUpcomingClasses = [
  {
    id: 1,
    course: "Inteligência Artificial",
    title: "Introdução ao Machine Learning",
    date: "Hoje",
    time: "14:00",
    duration: "50 min",
    students: 24,
    isLive: true,
  },
  {
    id: 2,
    course: "Empreendedorismo",
    title: "Validação de Ideias",
    date: "Amanhã",
    time: "15:30",
    duration: "50 min",
    students: 18,
    isLive: false,
  },
  {
    id: 3,
    course: "Marketing Digital",
    title: "Estratégias de Conteúdo",
    date: "Sexta",
    time: "16:00",
    duration: "50 min",
    students: 21,
    isLive: false,
  },
];

const mockPastClasses = [
  {
    id: 10,
    course: "Inteligência Artificial",
    title: "Introdução ao Machine Learning",
    date: "18 Out 2025",
    time: "14:00",
    duration: "50 min",
    students: 24,
    attendance: 22,
  },
  {
    id: 11,
    course: "Empreendedorismo",
    title: "Modelo de Negócios",
    date: "17 Out 2025",
    time: "15:30",
    duration: "50 min",
    students: 18,
    attendance: 17,
  },
  {
    id: 12,
    course: "Marketing Digital",
    title: "Funis de Vendas",
    date: "16 Out 2025",
    time: "16:00",
    duration: "50 min",
    students: 21,
    attendance: 19,
  },
  {
    id: 13,
    course: "Inteligência Artificial",
    title: "Redes Neurais Básicas",
    date: "15 Out 2025",
    time: "14:00",
    duration: "50 min",
    students: 24,
    attendance: 23,
  },
  {
    id: 14,
    course: "Empreendedorismo",
    title: "Pitch e Apresentação",
    date: "14 Out 2025",
    time: "15:30",
    duration: "50 min",
    students: 18,
    attendance: 18,
  },
];

const mockPendingHomework = [
  {
    id: 1,
    course: "Inteligência Artificial",
    title: "Projeto: Sistema de Recomendação",
    description:
      "Desenvolver um algoritmo básico de recomendação usando Python",
    dueDate: "25 Out 2025",
    daysLeft: 5,
    submittedCount: 18,
    totalStudents: 24,
    isUrgent: false,
  },
  {
    id: 2,
    course: "Empreendedorismo",
    title: "Canvas do Seu Projeto",
    description: "Preencher o Business Model Canvas da sua ideia de negócio",
    dueDate: "22 Out 2025",
    daysLeft: 2,
    submittedCount: 5,
    totalStudents: 18,
    isUrgent: true,
  },
  {
    id: 3,
    course: "Marketing Digital",
    title: "Análise de Concorrentes",
    description: "Mapear e analisar 3 concorrentes do seu nicho",
    dueDate: "28 Out 2025",
    daysLeft: 8,
    submittedCount: 12,
    totalStudents: 21,
    isUrgent: false,
  },
];

const mockToCorrect = [
  {
    id: 4,
    course: "Inteligência Artificial",
    title: "Introdução ao Python para IA",
    description: "Exercícios básicos de Python e bibliotecas NumPy",
    submittedDate: "15 Out 2025",
    submissionsToCorrect: 8,
    correctedCount: 16,
    totalStudents: 24,
  },
  {
    id: 5,
    course: "Empreendedorismo",
    title: "Pesquisa de Mercado",
    description: "Análise do mercado-alvo e personas",
    submittedDate: "12 Out 2025",
    submissionsToCorrect: 3,
    correctedCount: 15,
    totalStudents: 18,
  },
];

export function AdminHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl text-gray-900 mb-2">
          Bem-vindo, Professor! 👋
        </h1>
        <p className="text-gray-600">Gerencie suas aulas e tarefas de casa</p>
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
              {mockPendingHomework.length +
                mockToCorrect.reduce(
                  (acc, hw) => acc + hw.submissionsToCorrect,
                  0
                ) >
                0 && (
                <Badge className="ml-1 bg-[#f54a12] text-white border-0 h-5 px-2">
                  {mockPendingHomework.length +
                    mockToCorrect.reduce(
                      (acc, hw) => acc + hw.submissionsToCorrect,
                      0
                    )}
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
                          {class_.duration}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {class_.students} alunos
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
                      {class_.isLive ? "Entrar na Aula" : "Ver Detalhes"}
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
                          Presença: {class_.attendance}/{class_.students}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      Gerenciar
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Aba Tarefas de Casa */}
          <TabsContent value="tarefas" className="mt-6 space-y-6">
            {/* Tarefas Para Corrigir */}
            {mockToCorrect.length > 0 && (
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-sm">
                <div className="p-6 border-b border-red-200/50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#f54a12]" />
                    <h2 className="text-xl text-gray-900">
                      Aguardando Correção
                    </h2>
                    <Badge className="ml-auto bg-[#f54a12] text-white border-0">
                      {mockToCorrect.reduce(
                        (acc, hw) => acc + hw.submissionsToCorrect,
                        0
                      )}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {mockToCorrect.map((homework, index) => (
                    <motion.div
                      key={homework.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="p-4 rounded-xl border-2 border-[#f54a12] bg-white transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                              {homework.course}
                            </Badge>
                            <div className="flex items-center gap-1 text-[#f54a12] text-xs">
                              <AlertCircle className="w-3 h-3" />
                              <span>
                                {homework.submissionsToCorrect} para corrigir
                              </span>
                            </div>
                          </div>
                          <h3 className="text-gray-900 mb-1">
                            {homework.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {homework.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Última entrega: {homework.submittedDate}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-green-600">
                              {homework.correctedCount} corrigidas
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">
                              {homework.totalStudents} total
                            </span>
                          </div>
                        </div>
                        <Button className="flex-shrink-0 bg-gradient-to-r from-[#f54a12] to-[#ff6b35] hover:shadow-lg hover:shadow-[#f54a12]/30 text-white">
                          Corrigir Agora
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tarefas Pendentes (aguardando entregas) */}
            {mockPendingHomework.length > 0 && (
              <Card className="bg-white border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#599fe9]" />
                    <h2 className="text-xl text-gray-900">Tarefas Ativas</h2>
                    <Badge className="ml-auto bg-[#599fe9]/20 text-[#599fe9] border-0">
                      {mockPendingHomework.length}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {mockPendingHomework.map((homework, index) => (
                    <motion.div
                      key={homework.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className={`p-4 rounded-xl border-2 bg-gray-50 transition-all hover:shadow-md ${
                        homework.isUrgent
                          ? "border-amber-300 bg-amber-50/50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                              {homework.course}
                            </Badge>
                            {homework.isUrgent && (
                              <div className="flex items-center gap-1 text-amber-600 text-xs">
                                <Clock className="w-3 h-3" />
                                <span>Prazo próximo</span>
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
                            <span className="text-gray-600">
                              Prazo: <strong>{homework.dueDate}</strong>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span
                              className={
                                homework.isUrgent
                                  ? "text-amber-600"
                                  : "text-gray-500"
                              }
                            >
                              {homework.daysLeft}{" "}
                              {homework.daysLeft === 1 ? "dia" : "dias"}{" "}
                              restantes
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">
                              {homework.submittedCount}/{homework.totalStudents}{" "}
                              entregues
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
