import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import { 
  Award,
  Download,
  Search,
  Calendar,
  Trophy,
  CheckCircle
} from "lucide-react";
import { Input } from "../new-layout/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../new-layout/ui/select";

const certificatedStudents = [
  {
    id: 1,
    name: "Ana Silva",
    course: "Inteligência Artificial",
    completionDate: "15 Out 2025",
    finalScore: 9.5,
    attendance: 97.5,
    certificateNumber: "NITRO-IA-2025-001"
  },
  {
    id: 2,
    name: "Carlos Santos",
    course: "Empreendedorismo",
    completionDate: "12 Out 2025",
    finalScore: 9.2,
    attendance: 97.2,
    certificateNumber: "NITRO-EMPR-2025-015"
  },
  {
    id: 3,
    name: "Mariana Costa",
    course: "Marketing Digital",
    completionDate: "10 Out 2025",
    finalScore: 8.7,
    attendance: 94.7,
    certificateNumber: "NITRO-MKT-2025-023"
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    course: "Desenvolvimento Web",
    completionDate: "08 Out 2025",
    finalScore: 8.5,
    attendance: 92.9,
    certificateNumber: "NITRO-DEV-2025-042"
  },
  {
    id: 5,
    name: "Julia Ferreira",
    course: "Design UX/UI",
    completionDate: "05 Out 2025",
    finalScore: 8.2,
    attendance: 91.4,
    certificateNumber: "NITRO-DESIGN-2025-018"
  },
  {
    id: 6,
    name: "Fernando Alves",
    course: "Inteligência Artificial",
    completionDate: "02 Out 2025",
    finalScore: 9.8,
    attendance: 98.0,
    certificateNumber: "NITRO-IA-2025-002"
  },
  {
    id: 7,
    name: "Gabriela Lima",
    course: "Marketing Digital",
    completionDate: "28 Set 2025",
    finalScore: 9.1,
    attendance: 96.5,
    certificateNumber: "NITRO-MKT-2025-024"
  },
  {
    id: 8,
    name: "Rafael Santos",
    course: "Empreendedorismo",
    completionDate: "25 Set 2025",
    finalScore: 8.9,
    attendance: 95.0,
    certificateNumber: "NITRO-EMPR-2025-016"
  },
];

const monthlyData = [
  { month: "Jan", count: 8 },
  { month: "Fev", count: 12 },
  { month: "Mar", count: 15 },
  { month: "Abr", count: 10 },
  { month: "Mai", count: 14 },
  { month: "Jun", count: 18 },
  { month: "Jul", count: 11 },
  { month: "Ago", count: 16 },
  { month: "Set", count: 13 },
  { month: "Out", count: 7 },
];

export function DirectorCertificates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");

  const filteredStudents = certificatedStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || student.course === filterCourse;
    const matchesMonth = filterMonth === "all" || student.completionDate.includes(filterMonth);
    return matchesSearch && matchesCourse && matchesMonth;
  });

  const totalCertificates = certificatedStudents.length;
  const thisMonth = certificatedStudents.filter(s => s.completionDate.includes("Out 2025")).length;
  const avgScore = (certificatedStudents.reduce((acc, s) => acc + s.finalScore, 0) / certificatedStudents.length).toFixed(1);
  const avgAttendance = (certificatedStudents.reduce((acc, s) => acc + s.attendance, 0) / certificatedStudents.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Certificados Emitidos</h2>
          <p className="text-gray-600">Alunos que concluíram os cursos com sucesso</p>
        </div>
        <Button className="bg-[#599fe9] hover:bg-[#4a8ed9] text-white self-start sm:self-center">
          <Download className="w-4 h-4 mr-2" />
          Exportar Lista
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total de Certificados</p>
                  <p className="text-2xl text-gray-900">{totalCertificates}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Desde janeiro de 2025</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Este Mês</p>
                  <p className="text-2xl text-gray-900">{thisMonth}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Outubro de 2025</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Nota Média</p>
                  <p className="text-2xl text-gray-900">{avgScore}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Dos alunos certificados</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Frequência Média</p>
                  <p className="text-2xl text-gray-900">{avgAttendance}%</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Dos alunos certificados</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#599fe9]" />
              <h3 className="text-xl text-gray-900">Certificados por Mês (2025)</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-10 gap-2">
              {monthlyData.map((month, index) => (
                <div key={month.month} className="text-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${month.count * 8}px` }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                    className="bg-gradient-to-t from-[#8b5cf6] to-[#a78bfa] rounded-t-lg mx-auto w-full"
                    style={{ minHeight: "24px" }}
                  />
                  <p className="text-xs text-gray-500 mt-2">{month.month}</p>
                  <p className="text-sm text-gray-900">{month.count}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
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
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os meses</SelectItem>
                  <SelectItem value="Out 2025">Outubro 2025</SelectItem>
                  <SelectItem value="Set 2025">Setembro 2025</SelectItem>
                  <SelectItem value="Ago 2025">Agosto 2025</SelectItem>
                  <SelectItem value="Jul 2025">Julho 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Certificates Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-white border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl text-gray-900">Lista de Alunos Certificados</h3>
              <Badge className="bg-gray-100 text-gray-700 border-0">
                {filteredStudents.length} certificados
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
                    Data de Conclusão
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Nota Final
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Frequência
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Nº Certificado
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900">
                      {student.completionDate}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`${student.finalScore >= 9 ? 'text-green-600' : student.finalScore >= 8 ? 'text-blue-600' : 'text-gray-900'}`}>
                        {student.finalScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900">
                      {student.attendance}%
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs font-mono">
                      {student.certificateNumber}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
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
