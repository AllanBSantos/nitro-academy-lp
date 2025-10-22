import { useState } from "react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../new-layout/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../new-layout/ui/table";
import { Badge } from "../new-layout/ui/badge";
import { Input } from "../new-layout/ui/input";
import { Search, Download, FileText, School, UserX, TrendingUp } from "lucide-react";
import { Button } from "../new-layout/ui/button";
import { Card } from "../new-layout/ui/card";
import { ImportStudentsDialog } from "./ImportStudentsDialog";

type Student = {
  id: string;
  name: string;
  phone: string;
  responsibleName: string;
  responsiblePhone: string;
  course: string;
  partnerSchool: string | null;
  class: string;
};

// Mock data based on the image
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Luiza Fagnani",
    phone: "189976559977",
    responsibleName: "Antonio Fagnani Filho",
    responsiblePhone: "189972277175",
    course: "Investimento e Finanças",
    partnerSchool: "Colégio Anglo Araçatuba",
    class: "1",
  },
  {
    id: "2",
    name: "Samuel Tenório Dos Reis",
    phone: "(11) 91494-9465",
    responsibleName: "Evilaco Alves Dos Reis",
    responsiblePhone: "(11) 96157-1134",
    course: "Empreendedorismo",
    partnerSchool: "Colégio Santa Mônica",
    class: "1",
  },
  {
    id: "3",
    name: "Guilherme Marini Moreno",
    phone: "(17) 98841-4299",
    responsibleName: "Josiane Marini Moreno",
    responsiblePhone: "(17) 98165-3344",
    course: "Inteligência Artificial",
    partnerSchool: "Colégio Plus",
    class: "1",
  },
  {
    id: "4",
    name: "Maria Silva",
    phone: "(11) 98765-4321",
    responsibleName: "João Silva",
    responsiblePhone: "(11) 98765-1234",
    course: "Marketing Digital",
    partnerSchool: null,
    class: "2",
  },
  {
    id: "5",
    name: "Pedro Santos",
    phone: "(11) 99876-5432",
    responsibleName: "Ana Santos",
    responsiblePhone: "(11) 99876-1234",
    course: "Desenvolvimento de Produtos",
    partnerSchool: null,
    class: "2",
  },
];

type ReportType = "all" | "partner" | "no-link";

export function AdminStudents() {
  const [reportType, setReportType] = useState<ReportType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = mockStudents.filter((student) => {
    // Filter by report type
    if (reportType === "partner" && !student.partnerSchool) return false;
    if (reportType === "no-link" && student.partnerSchool) return false;

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(search) ||
        student.phone.includes(search) ||
        student.responsibleName.toLowerCase().includes(search) ||
        student.course.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const handleExport = () => {
    // Mock export functionality
    console.log("Exporting students data...");
  };

  const totalStudents = mockStudents.length;
  const partnersCount = mockStudents.filter((s) => s.partnerSchool).length;
  const noLinkCount = mockStudents.filter((s) => !s.partnerSchool).length;

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
              <div className="p-2 bg-[#599fe9]/10 rounded-lg">
                <FileText className="w-5 h-5 text-[#599fe9]" />
              </div>
              <TrendingUp className="w-4 h-4 text-[#599fe9]" />
            </div>
            <p className="text-gray-600 text-xs mb-1">Total de Alunos</p>
            <p className="text-3xl text-gray-900">{totalStudents}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <School className="w-5 h-5 text-emerald-500" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-gray-600 text-xs mb-1">Escolas Parceiras</p>
            <p className="text-3xl text-gray-900">{partnersCount}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <UserX className="w-5 h-5 text-amber-500" />
              </div>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-gray-600 text-xs mb-1">Sem Vínculo</p>
            <p className="text-3xl text-gray-900">{noLinkCount}</p>
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-3">Tipo de Relatório</label>
              <Select
                value={reportType}
                onValueChange={(value: ReportType) => setReportType(value)}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg hover:bg-gray-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alunos Matriculados</SelectItem>
                  <SelectItem value="partner">Alunos de Escolas Parceiras</SelectItem>
                  <SelectItem value="no-link">Alunos sem Vínculos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-3">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nome, telefone, curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 rounded-lg hover:bg-gray-100 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-end gap-3">
              {reportType === "partner" && <ImportStudentsDialog />}
              <Button
                onClick={handleExport}
                className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead className="text-gray-700">Nome do Aluno</TableHead>
                  <TableHead className="text-gray-700">Telefone</TableHead>
                  <TableHead className="text-gray-700">Responsável</TableHead>
                  <TableHead className="text-gray-700">Tel. Responsável</TableHead>
                  <TableHead className="text-gray-700">Curso</TableHead>
                  <TableHead className="text-gray-700">Escola Parceira</TableHead>
                  <TableHead className="text-gray-700">Turma</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="text-gray-900">{student.name}</TableCell>
                    <TableCell className="text-gray-600 font-mono text-sm">
                      {student.phone}
                    </TableCell>
                    <TableCell className="text-gray-900">{student.responsibleName}</TableCell>
                    <TableCell className="text-gray-600 font-mono text-sm">
                      {student.responsiblePhone}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30">
                        {student.course}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {student.partnerSchool ? (
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-emerald-500" />
                          <span className="text-gray-900">{student.partnerSchool}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        Turma {student.class}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">Nenhum aluno encontrado.</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
