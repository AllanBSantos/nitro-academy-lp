import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import { 
  TrendingUp,
  Star,
  Award,
  Download,
  Search,
  MessageSquare
} from "lucide-react";
import { Input } from "../new-layout/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../new-layout/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const studentsPerformance = [
  { 
    id: 1, 
    name: "Ana Silva", 
    course: "Inteligência Artificial",
    participationScore: 9.5,
    homeworkScore: 9.2,
    projectScore: 9.8,
    overallScore: 9.5,
    level: "excelente"
  },
  { 
    id: 2, 
    name: "Carlos Santos", 
    course: "Empreendedorismo",
    participationScore: 9.0,
    homeworkScore: 9.4,
    projectScore: 9.1,
    overallScore: 9.2,
    level: "excelente"
  },
  { 
    id: 3, 
    name: "Mariana Costa", 
    course: "Marketing Digital",
    participationScore: 8.5,
    homeworkScore: 8.8,
    projectScore: 8.9,
    overallScore: 8.7,
    level: "bom"
  },
  { 
    id: 4, 
    name: "Pedro Oliveira", 
    course: "Desenvolvimento Web",
    participationScore: 8.2,
    homeworkScore: 8.5,
    projectScore: 8.7,
    overallScore: 8.5,
    level: "bom"
  },
  { 
    id: 5, 
    name: "Julia Ferreira", 
    course: "Design UX/UI",
    participationScore: 8.0,
    homeworkScore: 8.3,
    projectScore: 8.4,
    overallScore: 8.2,
    level: "bom"
  },
  { 
    id: 6, 
    name: "Roberto Lima", 
    course: "Inteligência Artificial",
    participationScore: 7.2,
    homeworkScore: 7.5,
    projectScore: 7.8,
    overallScore: 7.5,
    level: "regular"
  },
  { 
    id: 7, 
    name: "Camila Souza", 
    course: "Marketing Digital",
    participationScore: 7.0,
    homeworkScore: 7.3,
    projectScore: 7.4,
    overallScore: 7.2,
    level: "regular"
  },
  { 
    id: 8, 
    name: "Lucas Mendes", 
    course: "Empreendedorismo",
    participationScore: 6.5,
    homeworkScore: 6.8,
    projectScore: 6.7,
    overallScore: 6.7,
    level: "melhorar"
  },
];

const averageByCategory = [
  { category: "Participação", value: 8.2 },
  { category: "Tarefas", value: 8.5 },
  { category: "Projetos", value: 8.6 },
];

const radarData = [
  { subject: "Participação", A: 8.2, fullMark: 10 },
  { subject: "Tarefas de Casa", A: 8.5, fullMark: 10 },
  { subject: "Projetos", A: 8.6, fullMark: 10 },
  { subject: "Criatividade", A: 8.4, fullMark: 10 },
  { subject: "Colaboração", A: 8.7, fullMark: 10 },
  { subject: "Pontualidade", A: 9.0, fullMark: 10 },
];

export function DirectorPerformance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "excelente":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Excelente</Badge>;
      case "bom":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Bom</Badge>;
      case "regular":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Regular</Badge>;
      case "melhorar":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Precisa Melhorar</Badge>;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600";
    if (score >= 8) return "text-blue-600";
    if (score >= 7) return "text-amber-600";
    return "text-red-600";
  };

  const filteredStudents = studentsPerformance.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || student.course === filterCourse;
    const matchesLevel = filterLevel === "all" || student.level === filterLevel;
    return matchesSearch && matchesCourse && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Análise de Desempenho</h2>
          <p className="text-gray-600">Avaliação de participação e notas dos alunos</p>
        </div>
        <Button className="bg-[#599fe9] hover:bg-[#4a8ed9] text-white self-start sm:self-center">
          <Download className="w-4 h-4 mr-2" />
          Exportar Análise
        </Button>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#599fe9]" />
                <h3 className="text-xl text-gray-900">Média por Categoria</h3>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={averageByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#19184b', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="#599fe9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#f54a12]" />
                <h3 className="text-xl text-gray-900">Competências Gerais</h3>
              </div>
            </div>
            <div className="p-6 flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#6b7280" />
                  <Radar name="Média Geral" dataKey="A" stroke="#f54a12" fill="#f54a12" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#19184b', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Excelente</p>
                  <p className="text-2xl text-gray-900">2</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Nota ≥ 9.0</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Bom</p>
                  <p className="text-2xl text-gray-900">3</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Nota 8.0 - 8.9</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Regular</p>
                  <p className="text-2xl text-gray-900">2</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Nota 7.0 - 7.9</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Precisa Melhorar</p>
                  <p className="text-2xl text-gray-900">1</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Nota &lt; 7.0</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-white border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cursos</SelectItem>
                  <SelectItem value="Inteligência Artificial">Inteligência Artificial</SelectItem>
                  <SelectItem value="Empreendedorismo">Empreendedorismo</SelectItem>
                  <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                  <SelectItem value="Desenvolvimento Web">Desenvolvimento Web</SelectItem>
                  <SelectItem value="Design UX/UI">Design UX/UI</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="excelente">Excelente</SelectItem>
                  <SelectItem value="bom">Bom</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="melhorar">Precisa Melhorar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-white border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl text-gray-900">Notas Detalhadas por Aluno</h3>
              <Badge className="bg-gray-100 text-gray-700 border-0">
                {filteredStudents.length} alunos
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Participação
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Tarefas
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Projetos
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Média Geral
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Nível
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {student.course}
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreColor(student.participationScore)}`}>
                      {student.participationScore.toFixed(1)}
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreColor(student.homeworkScore)}`}>
                      {student.homeworkScore.toFixed(1)}
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreColor(student.projectScore)}`}>
                      {student.projectScore.toFixed(1)}
                    </td>
                    <td className={`px-6 py-4 text-center ${getScoreColor(student.overallScore)}`}>
                      {student.overallScore.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getLevelBadge(student.level)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
