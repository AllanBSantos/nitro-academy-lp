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
import { Search, Download, FileText, School, UserX, TrendingUp, Inbox } from "lucide-react";
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

type ReportType = "all" | "partner" | "no-link";

export function AdminStudents() {
  const [reportType, setReportType] = useState<ReportType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const students: Student[] = [];

  const filteredStudents = students.filter((student) => {
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
    // Export functionality to be implemented
  };

  const totalStudents = students.length;
  const partnersCount = students.filter((s) => s.partnerSchool).length;
  const noLinkCount = students.filter((s) => !s.partnerSchool).length;

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
                disabled={filteredStudents.length === 0}
                className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#f54a12] disabled:hover:shadow-lg disabled:hover:shadow-[#f54a12]/20 disabled:bg-gray-400 disabled:hover:bg-gray-400"
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
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Inbox className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg text-gray-900 mb-2">Nenhum aluno encontrado</h3>
                      <p className="text-gray-500">
                        {searchTerm || reportType !== "all"
                          ? "Tente ajustar os filtros de busca."
                          : "Não há alunos cadastrados no momento."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
