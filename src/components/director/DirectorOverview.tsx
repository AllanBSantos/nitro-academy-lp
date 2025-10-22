import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Badge } from "../new-layout/ui/badge";
import { 
  Users, 
  GraduationCap, 
  Award, 
  TrendingUp,
  Calendar,
  Clock,
  Trophy,
  Star,
  CheckCircle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const attendanceData = [
  { month: "Jan", taxa: 92 },
  { month: "Fev", taxa: 88 },
  { month: "Mar", taxa: 95 },
  { month: "Abr", taxa: 91 },
  { month: "Mai", taxa: 94 },
  { month: "Jun", taxa: 96 },
  { month: "Jul", taxa: 93 },
  { month: "Ago", taxa: 97 },
  { month: "Set", taxa: 95 },
  { month: "Out", taxa: 98 },
];

const coursesData = [
  { name: "Inteligência Artificial", alunos: 156 },
  { name: "Empreendedorismo", alunos: 142 },
  { name: "Marketing Digital", alunos: 128 },
  { name: "Desenvolvimento Web", alunos: 134 },
  { name: "Design UX/UI", alunos: 98 },
];

const performanceData = [
  { name: "Excelente", value: 42, color: "#10b981" },
  { name: "Bom", value: 35, color: "#599fe9" },
  { name: "Regular", value: 18, color: "#f59e0b" },
  { name: "Precisa Melhorar", value: 5, color: "#f54a12" },
];

const topStudents = [
  { name: "Ana Silva", course: "IA", points: 2850, avatar: "AS" },
  { name: "Carlos Santos", course: "Empreend.", points: 2720, avatar: "CS" },
  { name: "Mariana Costa", course: "Marketing", points: 2680, avatar: "MC" },
  { name: "Pedro Oliveira", course: "Dev Web", points: 2590, avatar: "PO" },
  { name: "Julia Ferreira", course: "Design", points: 2510, avatar: "JF" },
];

export function DirectorOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl text-gray-900 mb-2">Bem-vindo, Diretor! 👋</h1>
        <p className="text-gray-600">Acompanhe o desempenho geral da sua escola</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-[#599fe9] to-[#4a8ed9] border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/60" />
              </div>
              <p className="text-white/80 text-sm mb-1">Total de Alunos</p>
              <p className="text-3xl mb-2">658</p>
              <p className="text-xs text-white/60">+12% vs mês anterior</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-[#f54a12] to-[#ff6b35] border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/60" />
              </div>
              <p className="text-white/80 text-sm mb-1">Cursos Ativos</p>
              <p className="text-3xl mb-2">5</p>
              <p className="text-xs text-white/60">100% com turmas ativas</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-[#10b981] to-[#059669] border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/60" />
              </div>
              <p className="text-white/80 text-sm mb-1">Frequência Média</p>
              <p className="text-3xl mb-2">95%</p>
              <p className="text-xs text-white/60">+3% vs mês anterior</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-white/60" />
              </div>
              <p className="text-white/80 text-sm mb-1">Certificados Emitidos</p>
              <p className="text-3xl mb-2">124</p>
              <p className="text-xs text-white/60">Este mês: 18 novos</p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#599fe9]" />
                  <h2 className="text-xl text-gray-900">Evolução da Frequência</h2>
                </div>
                <Badge className="bg-green-100 text-green-700 border-0">
                  Crescimento
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[80, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#19184b', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="taxa" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Performance Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#599fe9]" />
                <h2 className="text-xl text-gray-900">Distribuição de Desempenho</h2>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#19184b', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students per Course */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#599fe9]" />
                <h2 className="text-xl text-gray-900">Alunos por Curso</h2>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coursesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" angle={-20} textAnchor="end" height={80} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#19184b', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="alunos" fill="#599fe9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Top Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#f54a12]" />
                <h2 className="text-xl text-gray-900">Top 5 Alunos</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <motion.div
                    key={student.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-1 min-w-[40px]">
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                      {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                      {index === 2 && <Trophy className="w-5 h-5 text-amber-600" />}
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#599fe9] to-[#4a8ed9] flex items-center justify-center text-white flex-shrink-0">
                      {student.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.course}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#f54a12]" />
                      <span className="text-sm text-gray-900">{student.points}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
