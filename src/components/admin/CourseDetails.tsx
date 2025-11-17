import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  Search,
  Download,
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

interface Student {
  id: number;
  nome: string;
  turma?: number;
  escola_parceira?: string;
  createdAt: string;
}

export function CourseDetails({ course, onBack }: CourseDetailsProps) {
  const t = useTranslations("Admin.panel.course_details");
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial tab from URL or default to "students"
  const getInitialTab = () => {
    const tab = searchParams.get("courseTab");
    return tab && ["students", "classes", "schedules", "details"].includes(tab) ? tab : "students";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTurma, setSelectedTurma] = useState<string>("all");
  const [selectedEscola, setSelectedEscola] = useState<string>("all");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    description: string;
  } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aulas, setAulas] = useState<any[]>([]);
  const [loadingAulas, setLoadingAulas] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    title: course.name,
    description:
      "Neste curso, os estudantes aprendem como os dados estão por trás das decisões, dos negócios e das tecnologias que fazem parte do cotidiano. Por meio de desafios em equipe, ferramentas digitais e projetos práticos, desenvolvem a capacidade de coletar, organizar e interpretar informações, transformando-as em soluções inteligentes.",
    mentorDescription:
      "Engenheiro de manufatura formado pela Unicamp e técnico em mecatrônica pela ETEC Basilides de Godoy, possui experiência em marketing digital, análise de dados, docência, gestão de CRM e inteligência artificial.",
  });

  const availableSlots = course.totalSlots - course.students;

  // Handle tab change - update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("courseTab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle back from class details
  const handleBackFromClass = () => {
    setSelectedClass(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("classId");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Note: handleClassSelect will be added when class list is implemented
  // It will update the URL with classId when a class is selected

  // Sync tab with URL
  useEffect(() => {
    const tab = getInitialTab();
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/admin/all-students?cursoId=${course.id}`);
        
        if (!response.ok) {
          throw new Error(t("error_loading_students"));
        }

        const data = await response.json();
        setStudents(data.data || []);
      } catch (err) {
        console.error("Error loading students:", err);
        setError(t("error_loading_students"));
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [course.id, t]);

  const loadAulas = useCallback(async () => {
    try {
      setLoadingAulas(true);
      const response = await fetch(`/api/aulas?cursoId=${course.id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error loading aulas:", response.status, errorData);
        setAulas([]);
        return;
      }

      const data = await response.json();
      setAulas(data.data || []);
    } catch (err) {
      console.error("Error loading aulas:", err);
      setAulas([]);
    } finally {
      setLoadingAulas(false);
    }
  }, [course.id]);

  useEffect(() => {
    if (activeTab === "classes") {
      loadAulas();
    }
  }, [activeTab, loadAulas]);

  const availableTurmas = Array.from(
    new Set(students.map((s) => s.turma).filter((t): t is number => t !== undefined && t !== null))
  ).sort((a, b) => a - b);

  const availableEscolas = Array.from(
    new Set(students.map((s) => s.escola_parceira).filter((e): e is string => !!e))
  ).sort();

  const filteredStudents = students.filter((student) => {
    if (selectedTurma !== "all") {
      const turmaNum = parseInt(selectedTurma, 10);
      if (student.turma !== turmaNum) return false;
    }

    if (selectedEscola !== "all") {
      if (student.escola_parceira !== selectedEscola) return false;
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        student.nome.toLowerCase().includes(search) ||
        (student.turma && `turma ${student.turma}`.includes(search)) ||
        (student.escola_parceira && student.escola_parceira.toLowerCase().includes(search))
      );
    }
    return true;
  });

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
        courseId={course.id}
        onBack={handleBackFromClass}
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
          {t("back")}
        </Button>
        <div>
          <h1 className="text-3xl text-gray-900">{course.name}</h1>
          <p className="text-gray-500 mt-1">{t("manage_course")}</p>
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
            <p className="text-gray-600 text-xs mb-1">{t("total_spots")}</p>
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
            <p className="text-gray-600 text-xs mb-1">{t("enrolled_students")}</p>
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
            <p className="text-gray-600 text-xs mb-1">{t("available_spots")}</p>
            <p className="text-3xl text-gray-900">{availableSlots}</p>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="border-b border-gray-200">
            <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
              <TabsTrigger
                value="students"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#599fe9] rounded-none px-6 py-4 text-gray-600 data-[state=active]:text-[#599fe9]"
              >
                {t("tabs.students")}
              </TabsTrigger>
              <TabsTrigger
                value="classes"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#599fe9] rounded-none px-6 py-4 text-gray-600 data-[state=active]:text-[#599fe9]"
              >
                {t("tabs.classes")}
              </TabsTrigger>
              <TabsTrigger
                value="schedules"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#599fe9] rounded-none px-6 py-4 text-gray-600 data-[state=active]:text-[#599fe9]"
              >
                {t("tabs.schedules")}
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#599fe9] rounded-none px-6 py-4 text-gray-600 data-[state=active]:text-[#599fe9]"
              >
                {t("tabs.details")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Students Tab */}
          <TabsContent value="students" className="p-6 space-y-6">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-2">
                  {t("filters.filter_by_class")}
                </label>
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filters.all_classes")}</SelectItem>
                    {availableTurmas.map((turma) => (
                      <SelectItem key={turma} value={turma.toString()}>
                        {t("filters.class_label", { number: turma })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-2">
                  {t("filters.filter_by_school")}
                </label>
                <Select value={selectedEscola} onValueChange={setSelectedEscola}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filters.all_schools")}</SelectItem>
                    {availableEscolas.map((escola) => (
                      <SelectItem key={escola} value={escola}>
                        {escola}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 text-sm mb-2">{t("filters.search")}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("filters.search_placeholder")}
                    className="pl-10 bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20">
                  <Download className="w-5 h-5 mr-2" />
                  {t("filters.export_pdf")}
                </Button>
              </div>
            </div>

            {/* Students Table */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f54a12] mx-auto"></div>
                <p className="text-gray-600 mt-4">{t("loading_students")}</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">{t("no_students_found")}</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? t("adjust_filters")
                    : t("no_enrolled_students")}
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700">{t("table.name")}</TableHead>
                      <TableHead className="text-gray-700">{t("table.class")}</TableHead>
                      <TableHead className="text-gray-700">{t("table.school")}</TableHead>
                      <TableHead className="text-gray-700">{t("table.enrolled_at")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-50">
                        <TableCell className="text-gray-900">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 bg-[#599fe9] text-white">
                              <AvatarFallback className="bg-[#599fe9] text-white">
                                {getInitials(student.nome)}
                              </AvatarFallback>
                            </Avatar>
                            {student.nome}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {student.turma ? t("filters.class_label", { number: student.turma }) : "-"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {student.escola_parceira || "-"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(student.createdAt).toLocaleString("pt-BR")}
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
              <h2 className="text-xl text-gray-900">{t("classes.title")}</h2>
              <RegisterClassDialog courseId={course.id} onSuccess={loadAulas} />
            </div>

            {loadingAulas ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f54a12] mx-auto"></div>
                <p className="text-gray-600 mt-4">Carregando aulas...</p>
              </div>
            ) : aulas.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">
                  {t("classes.no_classes")}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t("classes.no_classes_description")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {aulas.map((aula) => {
                  const aulaIdentifier =
                    aula.documentId || aula.id?.toString() || "";
                  const aulaDate = new Date(aula.data);
                  const formattedDate = aulaDate.toLocaleDateString("pt-BR");
                  const formattedTime = aulaDate.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  
                  return (
                    <Card
                      key={aulaIdentifier || aula.id}
                      className="bg-white border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative flex flex-col"
                    >
                      {/* Botão Gerenciar no canto superior direito */}
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClass({
                              id: aulaIdentifier,
                              title: aula.titulo,
                              date: formattedDate,
                              time: formattedTime,
                              duration: "",
                              description: "",
                            });
                          }}
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-3"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          {t("classes.manage")}
                        </Button>
                      </div>

                      {/* Título */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1 pr-24">
                        {aula.titulo}
                      </h3>

                      {/* Descrição */}
                      {aula.descricao && (
                        <p className="text-sm text-gray-500 mb-4">
                          {aula.descricao}
                        </p>
                      )}

                      {/* Data e Horário no canto inferior esquerdo */}
                      <div className="flex items-center gap-4 text-gray-600 mt-auto">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{formattedTime}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="p-6">
            <CourseSchedules />
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-gray-900">{t("details.title")}</h2>
              {!isEditingDetails ? (
                <Button
                  onClick={() => setIsEditingDetails(true)}
                  className="bg-[#599fe9] hover:bg-[#599fe9]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#599fe9]/20"
                >
                  <Edit2 className="w-5 h-5 mr-2" />
                  {t("details.edit")}
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingDetails(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 h-11 px-6"
                  >
                    {t("details.cancel")}
                  </Button>
                  <Button
                    onClick={handleSaveDetails}
                    className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {t("details.save")}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">
                  {t("details.course_title")}
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
                  {t("details.description")}
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
                  {t("details.mentor_description")}
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
