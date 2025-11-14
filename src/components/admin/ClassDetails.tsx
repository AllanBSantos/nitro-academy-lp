import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  Inbox,
} from "lucide-react";
import { Button } from "../new-layout/ui/button";
import { Card } from "../new-layout/ui/card";
import { Input } from "../new-layout/ui/input";
import { Textarea } from "../new-layout/ui/textarea";
import { Checkbox } from "../new-layout/ui/checkbox";
import { Avatar, AvatarFallback } from "../new-layout/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../new-layout/ui/table";
import { toast } from "sonner";
import { StudentCommentDialog } from "./StudentCommentDialog";

interface ClassDetailsProps {
  classItem: {
    id: number;
    title: string;
    date: string;
    time: string;
    duration: string;
    description: string;
  };
  onBack: () => void;
}

interface StudentAttendance {
  id: number;
  name: string;
  present: boolean;
  spinners: number;
  comment: string;
}

interface Material {
  id: number;
  name: string;
  type: string;
  uploadedAt: string;
}

export function ClassDetails({ classItem, onBack }: ClassDetailsProps) {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [notes, setNotes] = useState(
    "Os alunos demonstraram grande interesse no tema. A aula foi produtiva e todos participaram ativamente das discussões."
  );
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      name: "Slides - Introdução.pdf",
      type: "PDF",
      uploadedAt: "15/08/2025, 14:30",
    },
    {
      id: 2,
      name: "Exercícios Práticos.docx",
      type: "DOCX",
      uploadedAt: "15/08/2025, 15:00",
    },
  ]);

  const handlePresenceToggle = (studentId: number) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const handleSpinnersChange = (studentId: number, value: number) => {
    if (value >= 0 && value <= 33) {
      setStudents(
        students.map((student) =>
          student.id === studentId ? { ...student, spinners: value } : student
        )
      );
    }
  };

  const handleCommentChange = (studentId: number, comment: string) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, comment } : student
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newMaterial: Material = {
        id: materials.length + 1,
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "FILE",
        uploadedAt: new Date().toLocaleString("pt-BR"),
      };
      setMaterials([...materials, newMaterial]);
      toast.success("Material anexado com sucesso!");
    }
  };

  const handleDeleteMaterial = (materialId: number) => {
    setMaterials(materials.filter((m) => m.id !== materialId));
    toast.success("Material removido com sucesso!");
  };

  const handleSave = () => {
    toast.success("Dados da aula salvos com sucesso!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.length - presentCount;
  const attendancePercentage = students.length > 0 ? (presentCount / students.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-11 px-4 mt-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{classItem.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>📅 {classItem.date}</span>
              <span>🕐 {classItem.time}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Presentes</p>
            <p className="text-4xl text-gray-900">{presentCount}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Ausentes</p>
            <p className="text-4xl text-gray-900">{absentCount}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#599fe9]/10 rounded-xl">
                <Users className="w-6 h-6 text-[#599fe9]" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Percentual de Presença</p>
            <p className="text-4xl text-gray-900">
              {attendancePercentage.toFixed(0)}%
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Attendance and Spinners */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl text-gray-900">Presença e Pontuação</h2>
          <p className="text-gray-600 text-sm mt-1">
            Marque a presença dos alunos e atribua spinners (0-33)
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700 w-12"></TableHead>
                <TableHead className="text-gray-700">Aluno</TableHead>
                <TableHead className="text-gray-700 text-center">
                  Presença
                </TableHead>
                <TableHead className="text-gray-700 text-center">
                  Spinners (0-33)
                </TableHead>
                <TableHead className="text-gray-700 text-center w-24">
                  Comentário
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Inbox className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">Nenhum aluno encontrado</h3>
                    <p className="text-gray-500">
                      Não há alunos matriculados nesta aula no momento.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                <TableRow
                  key={student.id}
                  className={`${
                    student.present ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <TableCell>
                    <Avatar className="w-8 h-8 bg-[#599fe9] text-white">
                      <AvatarFallback className="bg-[#599fe9] text-white text-xs">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={student.present}
                        onCheckedChange={() => handlePresenceToggle(student.id)}
                        className="w-5 h-5"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min="0"
                      max="33"
                      value={student.spinners}
                      onChange={(e) =>
                        handleSpinnersChange(
                          student.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={!student.present}
                      className="w-20 text-center bg-gray-50 border-gray-200 text-gray-900 h-9 mx-auto"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <StudentCommentDialog
                        studentName={student.name}
                        comment={student.comment}
                        onSave={(comment) =>
                          handleCommentChange(student.id, comment)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Materials */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-gray-900">Materiais da Aula</h2>
              <p className="text-gray-600 text-sm mt-1">
                Anexe PDFs, documentos, slides e outros materiais
              </p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#599fe9] text-white rounded-lg hover:bg-[#599fe9]/90 transition-colors h-11">
                <Upload className="w-5 h-5" />
                Anexar Material
              </span>
            </label>
          </div>
        </div>
        <div className="p-6">
          {materials.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Nenhum material anexado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#599fe9]/10 rounded-lg">
                      <FileText className="w-5 h-5 text-[#599fe9]" />
                    </div>
                    <div>
                      <p className="text-gray-900">{material.name}</p>
                      <p className="text-sm text-gray-500">
                        {material.type} • {material.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#599fe9] hover:text-[#599fe9] hover:bg-[#599fe9]/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Notes */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl text-gray-900">Anotações da Aula</h2>
          <p className="text-gray-600 text-sm mt-1">
            Registre observações sobre a aula, comportamento dos alunos, etc.
          </p>
        </div>
        <div className="p-6">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escreva suas anotações aqui..."
            className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg min-h-[150px] resize-none"
          />
        </div>
      </Card>
    </div>
  );
}
