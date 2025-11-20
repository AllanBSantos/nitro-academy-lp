import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
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
import {
  Search,
  Download,
  FileText,
  School,
  UserX,
  TrendingUp,
  Inbox,
} from "lucide-react";
import { Button } from "../new-layout/ui/button";
import { Card } from "../new-layout/ui/card";
import { ImportStudentsDialog } from "./ImportStudentsDialog";

type Student = {
  id: number;
  name: string;
  phone: string;
  responsibleName: string;
  responsiblePhone: string;
  courses: Array<{ id: number; titulo: string }>;
  partnerSchool: string | null;
  class: number | null;
};

type RelationAttributes = {
  nome?: string;
  titulo?: string;
  name?: string;
};

type RelationValue =
  | string
  | {
      data?: { attributes?: RelationAttributes | null } | null;
      attributes?: RelationAttributes | null;
    }
  | RelationAttributes
  | null
  | undefined;

type PartnerStudent = {
  id: number;
  name: string;
  phone: string;
  responsibleName: string;
  responsiblePhone: string;
  courseName: string;
  partnerSchool: string;
  className: string;
  status: "enrolled" | "not_enrolled";
};

type PartnerStudentAttributes = {
  id?: number;
  nome?: string;
  telefone_aluno?: string;
  telefone?: string;
  phone?: string;
  responsavel?: string;
  nome_responsavel?: string;
  telefone_responsavel?: string;
  telefoneResponsavel?: string;
  escola?: RelationValue;
  escola_old?: string;
  escola_parceira?: string;
  turma?: RelationValue | string;
  turma_old?: string;
  courseInfo?: {
    courseName?: string;
    course?: RelationValue;
  } | null;
  isEnrolled?: boolean;
};

type RawPartnerStudent = PartnerStudentAttributes & {
  id?: number;
  attributes?: PartnerStudentAttributes;
};

type PartnerStudentsResponse = {
  data?: RawPartnerStudent[];
  meta?: {
    pagination?: {
      page?: number;
      pageSize?: number;
      pageCount?: number;
      total?: number;
    };
  };
};

const getRelationValue = (relation: RelationValue): string => {
  if (!relation) return "";
  if (typeof relation === "string") return relation;

  const fromAttributes = (attrs?: RelationAttributes | null): string => {
    if (!attrs) return "";
    return attrs.nome || attrs.titulo || attrs.name || "";
  };

  if ("data" in relation && relation.data) {
    const value = fromAttributes(relation.data.attributes);
    if (value) return value;
  }

  if ("attributes" in relation && relation.attributes) {
    const value = fromAttributes(relation.attributes);
    if (value) return value;
  }

  return fromAttributes(relation as RelationAttributes);
};

const mapPartnerStudent = (student: RawPartnerStudent): PartnerStudent => {
  const attrs: PartnerStudentAttributes = student?.attributes
    ? { ...student.attributes }
    : { ...student };

  const partnerSchool =
    getRelationValue(attrs.escola) ||
    attrs.escola_old ||
    attrs.escola_parceira ||
    "";

  const className =
    getRelationValue(attrs.turma as RelationValue) ||
    attrs.turma_old ||
    (typeof attrs.turma === "string" ? attrs.turma : "");

  const courseName =
    attrs.courseInfo?.courseName ||
    getRelationValue(attrs.courseInfo?.course) ||
    "";

  return {
    id: student.id ?? attrs.id ?? Date.now(),
    name: attrs.nome || "",
    phone: attrs.telefone_aluno || attrs.telefone || attrs.phone || "",
    responsibleName: attrs.responsavel || attrs.nome_responsavel || "",
    responsiblePhone:
      attrs.telefone_responsavel || attrs.telefoneResponsavel || "",
    courseName,
    partnerSchool,
    className,
    status: attrs.isEnrolled ? "enrolled" : "not_enrolled",
  };
};

type ReportType = "all" | "partner" | "no-link";

export function AdminStudents() {
  const t = useTranslations("Admin.panel.admin_students");
  const [reportType, setReportType] = useState<ReportType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerStudents, setPartnerStudents] = useState<PartnerStudent[]>([]);
  const [partnerLoading, setPartnerLoading] = useState(true);
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const [partnerSchoolFilter, setPartnerSchoolFilter] = useState("all");
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<
    "all" | "enrolled" | "not_enrolled"
  >("all");

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/admin/all-students");

        if (!response.ok) {
          throw new Error(t("error_loading"));
        }

        const data = await response.json();
        const alunosFormatados: Student[] = (data.data || []).map(
          (aluno: {
            id: number;
            nome: string;
            telefone_aluno?: string;
            responsavel: string;
            telefone_responsavel: string;
            cursos: Array<{ id: number; titulo: string }>;
            escola_parceira?: string;
            turma?: number;
          }) => ({
            id: aluno.id,
            name: aluno.nome || "",
            phone: aluno.telefone_aluno || "",
            responsibleName: aluno.responsavel || "",
            responsiblePhone: aluno.telefone_responsavel || "",
            courses: aluno.cursos || [],
            partnerSchool: aluno.escola_parceira || null,
            class: aluno.turma || null,
          })
        );

        setStudents(alunosFormatados);
      } catch (err) {
        console.error("Error loading students:", err);
        setError(t("error_loading"));
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [t]);

  useEffect(() => {
    async function loadPartnerStudents() {
      try {
        setPartnerLoading(true);
        setPartnerError(null);

        const pageSize = 100;
        let currentPage = 1;
        let totalPages = 1;
        const allStudents: PartnerStudent[] = [];
        const timestamp = Date.now().toString();

        while (currentPage <= totalPages) {
          const params = new URLSearchParams({
            page: currentPage.toString(),
            pageSize: pageSize.toString(),
            _t: timestamp,
          });

          const response = await fetch(
            `/api/partner-students?${params.toString()}`,
            {
              cache: "no-store",
            }
          );

          if (!response.ok) {
            throw new Error(t("error_loading"));
          }

          const data: PartnerStudentsResponse = await response.json();
          const mapped: PartnerStudent[] = (data.data || []).map(
            (student) => mapPartnerStudent(student)
          );

          allStudents.push(...mapped);

          const pagination = data.meta?.pagination;
          totalPages = pagination?.pageCount || 1;
          currentPage += 1;
        }

        setPartnerStudents(allStudents);
      } catch (err) {
        console.error("Error loading partner students:", err);
        setPartnerError(t("error_loading"));
        setPartnerStudents([]);
      } finally {
        setPartnerLoading(false);
      }
    }

    loadPartnerStudents();
  }, [t]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const isPartnerView = reportType === "partner";
  const schoolFilterActive = reportType === "all" || reportType === "partner";
  const statusFilterActive = reportType === "partner";

  const filteredStudents = students.filter((student) => {
    // Filter by report type
    if (reportType === "partner" && !student.partnerSchool) return false;
    if (reportType === "no-link" && student.partnerSchool) return false;

    if (
      schoolFilterActive &&
      partnerSchoolFilter !== "all" &&
      student.partnerSchool !== partnerSchoolFilter
    ) {
      return false;
    }

    // Filter by search term
    if (normalizedSearch) {
      return (
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.phone.includes(normalizedSearch) ||
        student.responsibleName.toLowerCase().includes(normalizedSearch) ||
        student.courses.some((c) =>
          c.titulo.toLowerCase().includes(normalizedSearch)
        )
      );
    }

    return true;
  });

  const availablePartnerSchools = useMemo(() => {
    const schools = new Set<string>();
    students.forEach((student) => {
      if (student.partnerSchool) {
        schools.add(student.partnerSchool);
      }
    });
    partnerStudents.forEach((student) => {
      if (student.partnerSchool) {
        schools.add(student.partnerSchool);
      }
    });
    return Array.from(schools).sort((a, b) => a.localeCompare(b));
  }, [students, partnerStudents]);

  const partnerFilteredStudents = partnerStudents.filter((student) => {
    if (
      partnerSchoolFilter !== "all" &&
      student.partnerSchool !== partnerSchoolFilter
    ) {
      return false;
    }

    if (
      partnerStatusFilter !== "all" &&
      student.status !== partnerStatusFilter
    ) {
      return false;
    }

    if (normalizedSearch) {
      const valuesToSearch = [
        student.name,
        student.phone,
        student.responsibleName,
        student.responsiblePhone,
        student.courseName,
        student.partnerSchool,
        student.className,
      ]
        .filter(Boolean)
        .map((value) => value.toLowerCase());

      return valuesToSearch.some((value) =>
        value.includes(normalizedSearch)
      );
    }

    return true;
  });

  const currentLoading = isPartnerView ? partnerLoading : loading;
  const currentError = isPartnerView ? partnerError : error;
  const displayedStudentsCount = isPartnerView
    ? partnerFilteredStudents.length
    : filteredStudents.length;
  const exportDisabled = displayedStudentsCount === 0;
  const columnCount = isPartnerView ? 8 : 7;

  useEffect(() => {
    if (!schoolFilterActive && partnerSchoolFilter !== "all") {
      setPartnerSchoolFilter("all");
    }
  }, [schoolFilterActive, partnerSchoolFilter]);

  useEffect(() => {
    if (!statusFilterActive && partnerStatusFilter !== "all") {
      setPartnerStatusFilter("all");
    }
  }, [statusFilterActive, partnerStatusFilter]);

  const handleExport = () => {
    // Export functionality to be implemented
  };

  const totalStudents = students.length;
  const partnersCount = students.filter((s) => s.partnerSchool).length;
  const noLinkCount = students.filter((s) => !s.partnerSchool).length;

  if (currentLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f54a12] mx-auto"></div>
          <p className="text-gray-600 mt-4">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-red-600">{currentError}</p>
        </div>
      </div>
    );
  }

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
            <p className="text-gray-600 text-xs mb-1">{t("total_students")}</p>
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
            <p className="text-gray-600 text-xs mb-1">{t("partner_schools")}</p>
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
            <p className="text-gray-600 text-xs mb-1">{t("no_link")}</p>
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-3">
                  {t("report_type")}
                </label>
                <Select
                  value={reportType}
                  onValueChange={(value: ReportType) => setReportType(value)}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg hover:bg-gray-100 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("all_enrolled")}</SelectItem>
                    <SelectItem value="partner">
                      {t("partner_students")}
                    </SelectItem>
                    <SelectItem value="no-link">
                      {t("no_link_students")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-3">
                  {t("search")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t("search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-11 rounded-lg hover:bg-gray-100 transition-colors"
                  />
                </div>
              </div>

              <div className="min-h-[110px]">
                <label className="block text-gray-700 text-sm mb-3">
                  {t("partner_school_filter")}
                </label>
                <Select
                  value={partnerSchoolFilter}
                  onValueChange={(value) => setPartnerSchoolFilter(value)}
                  disabled={!schoolFilterActive}
                >
                  <SelectTrigger
                    disabled={!schoolFilterActive}
                    className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <SelectValue placeholder={t("all_partner_schools")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("all_partner_schools")}
                    </SelectItem>
                    {availablePartnerSchools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[110px]">
                <label className="block text-gray-700 text-sm mb-3">
                  {t("status_filter")}
                </label>
                <Select
                  value={partnerStatusFilter}
                  onValueChange={(value) =>
                    setPartnerStatusFilter(
                      value as "all" | "enrolled" | "not_enrolled"
                    )
                  }
                  disabled={!statusFilterActive}
                >
                  <SelectTrigger
                    disabled={!statusFilterActive}
                    className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <SelectValue placeholder={t("status_filter")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("status_options.all")}
                    </SelectItem>
                    <SelectItem value="enrolled">
                      {t("status_options.enrolled")}
                    </SelectItem>
                    <SelectItem value="not_enrolled">
                      {t("status_options.not_enrolled")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-end">
              {isPartnerView && <ImportStudentsDialog />}
              <Button
                onClick={handleExport}
                disabled={exportDisabled}
                className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
              >
                <Download className="w-5 h-5 mr-2" />
                {t("export")}
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
                  <TableHead className="text-gray-700">
                    {t("table.student_name")}
                  </TableHead>
                  <TableHead className="text-gray-700">
                    {t("table.phone")}
                  </TableHead>
                  <TableHead className="text-gray-700">
                    {t("table.responsible")}
                  </TableHead>
                  <TableHead className="text-gray-700">
                    {t("table.responsible_phone")}
                  </TableHead>
                  <TableHead className="text-gray-700">
                    {t("table.course")}
                  </TableHead>
                  <TableHead className="text-gray-700">
                    {t("table.partner_school")}
                  </TableHead>
                  <TableHead className="text-gray-700">
                    {t("table.class")}
                  </TableHead>
                  {isPartnerView && (
                    <TableHead className="text-gray-700">
                      {t("table.status")}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedStudentsCount === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columnCount} className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Inbox className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg text-gray-900 mb-2">
                        {t("no_students_found")}
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm || reportType !== "all"
                          ? t("adjust_filters")
                          : t("no_students_registered")}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : isPartnerView ? (
                  partnerFilteredStudents.map((student) => (
                    <TableRow
                      key={`partner-${student.id}`}
                      className="border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="text-gray-900">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">
                        {student.phone || "-"}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {student.responsibleName || "-"}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">
                        {student.responsiblePhone || "-"}
                      </TableCell>
                      <TableCell>
                        {student.courseName ? (
                          <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30">
                            {student.courseName}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {student.partnerSchool ? (
                          <div className="flex items-center gap-2">
                            <School className="w-4 h-4 text-emerald-500" />
                            <span className="text-gray-900">
                              {student.partnerSchool}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.className ? (
                          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                            {student.className}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`border ${
                            student.status === "enrolled"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }`}
                        >
                          {student.status === "enrolled"
                            ? t("status_options.enrolled")
                            : t("status_options.not_enrolled")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="text-gray-900">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">
                        {student.phone || "-"}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {student.responsibleName || "-"}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">
                        {student.responsiblePhone || "-"}
                      </TableCell>
                      <TableCell>
                        {student.courses && student.courses.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {student.courses.map((curso) => (
                              <Badge
                                key={curso.id}
                                className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30"
                              >
                                {curso.titulo}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {student.partnerSchool ? (
                          <div className="flex items-center gap-2">
                            <School className="w-4 h-4 text-emerald-500" />
                            <span className="text-gray-900">
                              {student.partnerSchool}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.class ? (
                          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                            {t("table.class_label", { number: student.class })}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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
