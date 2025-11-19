import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  GraduationCap,
  Calendar,
  Search,
  Download,
  Inbox,
} from "lucide-react";
import { Button } from "../new-layout/ui/button";
import { Card } from "../new-layout/ui/card";
import { Input } from "../new-layout/ui/input";
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
import CourseEditForm from "@/app/components/admin/CourseEditForm";
import { AdminCourseDetails } from "@/types/adminCourse";

interface CourseDetailsProps {
  course: {
    id: number;
    documentId: string;
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
  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    title: string;
    date: string;
    time: string;
    duration: string;
    description: string;
  } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseDetailsData, setCourseDetailsData] = useState<AdminCourseDetails | null>(null);
  const [courseDetailsLoading, setCourseDetailsLoading] = useState(true);
  const [courseDetailsError, setCourseDetailsError] = useState<string | null>(null);

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const fetchCourseDetails = useCallback(async () => {
    try {
      setCourseDetailsLoading(true);
      setCourseDetailsError(null);
      const response = await fetch(
        `/api/admin/course-details/${course.documentId}`
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Erro ao carregar detalhes");
      }
      setCourseDetailsData(payload.data);
    } catch (err) {
      console.error("Error loading course details:", err);
      setCourseDetailsError("Erro ao carregar detalhes do curso.");
      setCourseDetailsData(null);
    } finally {
      setCourseDetailsLoading(false);
    }
  }, [course.documentId]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  // If a class is selected, show class details
  if (selectedClass) {
    return (
      <ClassDetails
        classItem={selectedClass}
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
              <RegisterClassDialog />
            </div>

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
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="p-6">
            <CourseSchedules courseId={course.id} />
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-gray-900">{t("details.title")}</h2>
            </div>
            {courseDetailsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {courseDetailsError}
              </div>
            )}
            {courseDetailsLoading || !courseDetailsData ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <CourseEditForm
                course={courseDetailsData}
                documentId={course.documentId}
                onUpdateSuccess={fetchCourseDetails}
              />
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
