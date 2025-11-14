import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Users,
  GraduationCap,
  Calendar,
  Search,
  Download,
  BookOpen,
  Save,
  Edit2,
  Inbox,
} from "lucide-react";
import { Button } from "../new-layout/ui/button";
import { Card } from "../new-layout/ui/card";
import { Input } from "../new-layout/ui/input";
import { Textarea } from "../new-layout/ui/textarea";
import { Label } from "../new-layout/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../new-layout/ui/tabs";
import { RegisterClassDialog } from "./RegisterClassDialog";
import { Avatar, AvatarFallback } from "../new-layout/ui/avatar";
import { ClassDetails } from "./ClassDetails";
import { CourseSchedules } from "./CourseSchedules";

interface CourseDetailsProps {
  course: {
    id: number;
    name: string;
    campaign: string;
    students: number;
    totalSlots: number;
  };
  onBack: () => void;
}

export function CourseDetails({ course, onBack }: CourseDetailsProps) {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [courseDetails, setCourseDetails] = useState({
    title: course.name,
    description:
      "Neste curso, os estudantes aprendem como os dados estão por trás das decisões, dos negócios e das tecnologias que fazem parte do cotidiano. Por meio de desafios em equipe, ferramentas digitais e projetos práticos, desenvolvem a capacidade de coletar, organizar e interpretar informações, transformando-as em soluções inteligentes.",
    mentorDescription:
      "Engenheiro de manufatura formado pela Unicamp e técnico em mecatrônica pela ETEC Basilides de Godoy, possui experiência em marketing digital, análise de dados, docência, gestão de CRM e inteligência artificial.",
  });

  const availableSlots = course.totalSlots - course.students;
  const students: any[] = [];
  const filteredStudents: any[] = [];

  const handleSaveDetails = () => {
    setIsEditingDetails(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // If a class is selected, show class details
  if (selectedClass) {
    return (
      <ClassDetails
        classItem={selectedClass}
        onBack={() => setSelectedClass(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-11 px-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl text-gray-900">{course.name}</h1>
          <p className="text-gray-500 mt-1">Gerencie alunos, aulas e detalhes do curso</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-1">Total de Vagas</p>
            <p className="text-3xl text-gray-900">{course.totalSlots}</p>
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
                <GraduationCap className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-1">Alunos Matriculados</p>
            <p className="text-3xl text-gray-900">{course.students}</p>
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
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-1">Vagas Disponíveis</p>
            <p className="text-3xl text-gray-900">{availableSlots}</p>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
            <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
              <TabsTrigger
                value="students"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#599fe9] rounded-none px-6 py-4 text-gray-600 data-[state=active]:text-[#599fe9]"
              >
                Alunos
              </TabsTrigger>
              <TabsTrigger
                value="classes"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#599fe9] rounded-none px-6 py-4 text-gray-600 data-[state=active]:text-[#599fe9]"
              >
                Aulas
              </TabsTrigger>
              <TabsTrigger
                value="schedules"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#599fe9] rounded-none px-6 py-4 text-gray-600 data-[state=active]:text-[#599fe9]"
              >
                Turmas
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#599fe9] rounded-none px-6 py-4 text-gray-600 data-[state=active]:text-[#599fe9]"
              >
                Detalhes do curso
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Students Tab */}
          <TabsContent value="students" className="p-6 space-y-6">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-2">
                  Filtrar por Turma
                </label>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Turmas</SelectItem>
                    <SelectItem value="turma1">Turma 1</SelectItem>
                    <SelectItem value="turma2">Turma 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-2">
                  Filtrar por Escola
                </label>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Escolas</SelectItem>
                    <SelectItem value="anglo">Colégio Anglo Araçatuba</SelectItem>
                    <SelectItem value="estadual">
                      Escola Estadual Prof. João
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome..."
                    className="pl-10 bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20">
                  <Download className="w-5 h-5 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>

            {/* Students Table */}
            {filteredStudents.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Nenhum aluno encontrado</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Tente ajustar os filtros de busca."
                    : "Não há alunos matriculados neste curso."}
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700">Nome</TableHead>
                      <TableHead className="text-gray-700">Turma</TableHead>
                      <TableHead className="text-gray-700">Escola</TableHead>
                      <TableHead className="text-gray-700">Inscrito em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-50">
                        <TableCell className="text-gray-900">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 bg-[#599fe9] text-white">
                              <AvatarFallback className="bg-[#599fe9] text-white">
                                {getInitials(student.name)}
                              </AvatarFallback>
                            </Avatar>
                            {student.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {student.class}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {student.school}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {student.enrolledAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-gray-900">Aulas Registradas</h2>
              <RegisterClassDialog />
            </div>

            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">
                Nenhuma aula registrada
              </h3>
              <p className="text-gray-500 mb-6">
                Não há aulas cadastradas para este curso.
              </p>
            </div>
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="p-6">
            <CourseSchedules />
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-gray-900">Informações do Curso</h2>
              {!isEditingDetails ? (
                <Button
                  onClick={() => setIsEditingDetails(true)}
                  className="bg-[#599fe9] hover:bg-[#599fe9]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#599fe9]/20"
                >
                  <Edit2 className="w-5 h-5 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingDetails(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 h-11 px-6"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveDetails}
                    className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">
                  Título
                </Label>
                {isEditingDetails ? (
                  <Input
                    id="title"
                    value={courseDetails.title}
                    onChange={(e) =>
                      setCourseDetails({
                        ...courseDetails,
                        title: e.target.value,
                      })
                    }
                    className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {courseDetails.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  Descrição
                </Label>
                {isEditingDetails ? (
                  <Textarea
                    id="description"
                    value={courseDetails.description}
                    onChange={(e) =>
                      setCourseDetails({
                        ...courseDetails,
                        description: e.target.value,
                      })
                    }
                    className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg min-h-[120px] resize-none"
                  />
                ) : (
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {courseDetails.description}
                  </p>
                )}
              </div>

              {/* Mentor Description */}
              <div className="space-y-2">
                <Label htmlFor="mentorDescription" className="text-gray-700">
                  Descrição do Mentor
                </Label>
                {isEditingDetails ? (
                  <Textarea
                    id="mentorDescription"
                    value={courseDetails.mentorDescription}
                    onChange={(e) =>
                      setCourseDetails({
                        ...courseDetails,
                        mentorDescription: e.target.value,
                      })
                    }
                    className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg min-h-[100px] resize-none"
                  />
                ) : (
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {courseDetails.mentorDescription}
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
