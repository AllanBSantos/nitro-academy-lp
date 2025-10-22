import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import { 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Search
} from "lucide-react";
import { Input } from "../new-layout/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../new-layout/ui/select";

const studentsAttendance = [
  { 
    id: 1, 
    name: "Ana Silva", 
    course: "Inteligência Artificial", 
    totalClasses: 40, 
    attended: 39, 
    missed: 1, 
    percentage: 97.5,
    status: "excelente" 
  },
  { 
    id: 2, 
    name: "Carlos Santos", 
    course: "Empreendedorismo", 
    totalClasses: 36, 
    attended: 35, 
    missed: 1, 
    percentage: 97.2,
    status: "excelente" 
  },
  { 
    id: 3, 
    name: "Mariana Costa", 
    course: "Marketing Digital", 
    totalClasses: 38, 
    attended: 36, 
    missed: 2, 
    percentage: 94.7,
    status: "bom" 
  },
  { 
    id: 4, 
    name: "Pedro Oliveira", 
    course: "Desenvolvimento Web", 
    totalClasses: 42, 
    attended: 39, 
    missed: 3, 
    percentage: 92.9,
    status: "bom" 
  },
  { 
    id: 5, 
    name: "Julia Ferreira", 
    course: "Design UX/UI", 
    totalClasses: 35, 
    attended: 32, 
    missed: 3, 
    percentage: 91.4,
    status: "bom" 
  },
  { 
    id: 6, 
    name: "Roberto Lima", 
    course: "Inteligência Artificial", 
    totalClasses: 40, 
    attended: 34, 
    missed: 6, 
    percentage: 85.0,
    status: "regular" 
  },
  { 
    id: 7, 
    name: "Camila Souza", 
    course: "Marketing Digital", 
    totalClasses: 38, 
    attended: 32, 
    missed: 6, 
    percentage: 84.2,
    status: "regular" 
  },
  { 
    id: 8, 
    name: "Lucas Mendes", 
    course: "Empreendedorismo", 
    totalClasses: 36, 
    attended: 27, 
    missed: 9, 
    percentage: 75.0,
    status: "atencao" 
  },
  { 
    id: 9, 
    name: "Beatriz Alves", 
    course: "Desenvolvimento Web", 
    totalClasses: 42, 
    attended: 30, 
    missed: 12, 
    percentage: 71.4,
    status: "atencao" 
  },
  { 
    id: 10, 
    name: "Gabriel Rocha", 
    course: "Design UX/UI", 
    totalClasses: 35, 
    attended: 24, 
    missed: 11, 
    percentage: 68.6,
    status: "atencao" 
  },
];

export function DirectorAttendance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excelente":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Excelente</Badge>;
      case "bom":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Bom</Badge>;
      case "regular":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Regular</Badge>;
      case "atencao":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Atenção</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excelente":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "bom":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "regular":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "atencao":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredStudents = studentsAttendance.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || student.course === filterCourse;
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
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
          <h2 className="text-2xl text-gray-900 mb-2">Relatório de Frequência</h2>
          <p className="text-gray-600">Acompanhe a presença dos alunos nas aulas</p>
        </div>
        <Button className="bg-[#599fe9] hover:bg-[#4a8ed9] text-white self-start sm:self-center">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Excelente</p>
                  <p className="text-2xl text-gray-900">2</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">≥ 95% de presença</p>
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
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Bom</p>
                  <p className="text-2xl text-gray-900">3</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">85% - 94% de presença</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Regular</p>
                  <p className="text-2xl text-gray-900">2</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">75% - 84% de presença</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Atenção</p>
                  <p className="text-2xl text-gray-900">3</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">&lt; 75% de presença</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="excelente">Excelente</SelectItem>
                  <SelectItem value="bom">Bom</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="atencao">Atenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-white border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl text-gray-900">Detalhamento por Aluno</h3>
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
                    Aulas Totais
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Presenças
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Faltas
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Taxa
                  </th>
                  <th className="px-6 py-4 text-center text-xs text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(student.status)}
                        <span className="text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900">
                      {student.totalClasses}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">{student.attended}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">{student.missed}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900">
                      {student.percentage}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(student.status)}
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
