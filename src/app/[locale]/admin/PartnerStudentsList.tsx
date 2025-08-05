/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Download,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  RefreshCw,
  FileDown,
} from "lucide-react";
import Papa from "papaparse";

interface PartnerStudent {
  id: number;
  nome: string;
  cpf: string;
  escola: string;
  turma: string;
  data_importacao?: string;
  isEnrolled?: boolean;
  courseInfo?: {
    courseName: string;
    schedule: {
      dia_semana?: string;
      horario_aula?: string;
    } | null;
  } | null;
}

const BATCH_SIZE = 20;

export default function PartnerStudentsList() {
  const t = useTranslations("Admin.partnerStudents");
  const [allStudents, setAllStudents] = useState<PartnerStudent[]>([]);

  // Filter states
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [enrollmentStatusFilter, setEnrollmentStatusFilter] =
    useState<string>("all"); // "all", "enrolled", "not_enrolled"
  const [showFilters, setShowFilters] = useState(false);
  const [availableSchools, setAvailableSchools] = useState<string[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [allClasses, setAllClasses] = useState<string[]>([]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const studentsPerPage = 100;

  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState("");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedSchools, selectedClasses, enrollmentStatusFilter]);

  useEffect(() => {
    fetchAvailableFilters();
  }, []);

  // Clear selected classes when schools change to avoid inconsistencies
  useEffect(() => {
    if (selectedSchools.length > 0) {
      // Remove classes that are no longer valid for selected schools
      const validClasses = availableClasses;
      const updatedClasses = selectedClasses.filter((classItem) =>
        validClasses.includes(classItem)
      );

      if (updatedClasses.length !== selectedClasses.length) {
        setSelectedClasses(updatedClasses);
      }
    }
  }, [availableClasses, selectedClasses, selectedSchools]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError(t("invalid_file_type"));
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // Remove espaços dos cabeçalhos
      complete: (results) => {
        const { data, errors } = results;

        if (errors.length > 0) {
          setError(t("csv_parse_error"));
          return;
        }

        const requiredColumns = ["Nome", "Escola"];
        const firstRow = data[0] as any;
        const normalizedFirstRow: Record<string, any> = {};
        Object.keys(firstRow).forEach((key) => {
          const normalizedKey = key.trim().toLowerCase();
          normalizedFirstRow[normalizedKey] = firstRow[key];
        });

        for (const column of requiredColumns) {
          const normalizedColumn = column.trim().toLowerCase();

          if (!(normalizedColumn in normalizedFirstRow)) {
            setError(
              t("missing_columns", { columns: requiredColumns.join(", ") })
            );
            return;
          }
        }

        const csvData = data.map((row: any) => {
          const normalizedRow: Record<string, any> = {};
          Object.keys(row).forEach((key) => {
            const normalizedKey = key.trim().toLowerCase();
            normalizedRow[normalizedKey] = row[key];
          });

          const mappedRow = {
            nome: normalizedRow["nome"] || row["NOME "] || row["Nome"] || "",
            cpf: normalizedRow["cpf"] || row["CPF"] || "",
            escola: normalizedRow["escola"] || row["Escola"] || "",
            turma:
              normalizedRow["turma"] ||
              row["ano/série "] ||
              row["ANO/SÉRIE "] ||
              row["Turma"] ||
              "",
          };
          return mappedRow;
        });

        importStudents(csvData);
      },
      error: (error) => {
        setError(t("file_read_error"));
        console.error("CSV parse error:", error);
      },
    });
  };

  const startProgressSimulation = () => {
    setImportProgress(0);
    setImportStatus(t("import_status_starting"));

    progressIntervalRef.current = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + 5;
      });
    }, 3000);
  };

  const stopProgressSimulation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const importStudents = async (csvData: any[]) => {
    setImporting(true);
    setError("");
    setSuccess("");
    setImportProgress(0);
    setImportStatus("");

    startProgressSimulation();

    try {
      setImportStatus(t("import_status_processing"));

      let index = 0;
      let totalImported = 0;
      const allErrors: string[] = [];

      while (index < csvData.length) {
        const batch = csvData.slice(index, index + BATCH_SIZE);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        const response = await fetch("/api/partner-students/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: batch }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error(t("import_invalid_response"));
        }

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || result.message || t("import_error"));
        }

        totalImported += result.imported;
        allErrors.push(...(result.errors || []));

        index += batch.length;

        setImportProgress(
          Math.min(90, Math.round((index / csvData.length) * 90))
        );
        setImportStatus(
          t("import_status_progress", {
            current: totalImported,
            total: csvData.length,
          })
        );

        await delay(500);
      }

      setImportProgress(100);
      setImportStatus(t("import_status_completed"));

      setTimeout(() => {
        setSuccess(t("import_success", { count: totalImported }));
        if (allErrors.length > 0) {
          setError(t("import_warnings", { errors: allErrors.join(", ") }));
        }
        fetchStudents();
        fetchAvailableFilters();
      }, 500);
    } catch (err: any) {
      console.error("Import error:", err);

      if (err.name === "AbortError") {
        setError(t("import_timeout"));
      } else {
        setError(err.message || t("import_error"));
      }
      // Recarregar dados mesmo em caso de erro
      fetchStudents();
      fetchAvailableFilters();
    } finally {
      stopProgressSimulation();
      setImporting(false);
      setImportProgress(0);
      setImportStatus("");
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Build query parameters with timestamp to prevent caching
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: studentsPerPage.toString(),
        _t: Date.now().toString(), // Add timestamp to prevent caching
      });

      // Add school filters
      if (selectedSchools.length > 0) {
        selectedSchools.forEach((school) => {
          params.append("escola", school);
        });
      }

      // Add class filters
      if (selectedClasses.length > 0) {
        selectedClasses.forEach((classItem) => {
          params.append("turma", classItem);
        });
      }

      // Add enrollment status filter
      if (enrollmentStatusFilter !== "all") {
        params.append("enrollmentStatus", enrollmentStatusFilter);
      }

      const response = await fetch(
        `/api/partner-students?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        const mappedStudents = (data.data || []).map((student: any) => {
          const mappedStudent = {
            id: student.id,
            nome: student.attributes?.nome || student.nome,
            cpf: student.attributes?.cpf || student.cpf,
            escola: student.attributes?.escola || student.escola,
            turma: student.attributes?.turma || student.turma,
            data_importacao:
              student.attributes?.data_importacao || student.data_importacao,
            isEnrolled: student.attributes?.isEnrolled || student.isEnrolled,
            courseInfo: student.attributes?.courseInfo || student.courseInfo,
          };

          return mappedStudent;
        });
        setAllStudents(mappedStudents);
        setTotalStudents(data.meta?.pagination?.total || 0);
        setTotalPages(data.meta?.pagination?.pageCount || 1);
      } else {
        setError(t("fetch_error"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableFilters = async () => {
    try {
      const response = await fetch(
        `/api/partner-students?page=1&pageSize=10000&_t=${Date.now()}`
      );
      if (response.ok) {
        const data = await response.json();
        const students = data.data || [];

        // Extract unique schools and classes
        const schools = Array.from(
          new Set(students.map((s: any) => s.attributes?.escola || s.escola))
        ).sort() as string[];
        const allClasses = Array.from(
          new Set(
            students
              .map((s: any) => s.attributes?.turma || s.turma)
              .filter(Boolean)
          )
        ).sort() as string[];

        setAvailableSchools(schools);
        setAllClasses(allClasses);
        setAvailableClasses(allClasses);
      }
    } catch (err) {
      console.error("Error fetching available filters:", err);
    }
  };

  const fetchClassesForSchools = useCallback(async () => {
    try {
      // Build query parameters for selected schools
      const params = new URLSearchParams();
      selectedSchools.forEach((school) => {
        params.append("escola", school);
      });

      const response = await fetch(
        `/api/partner-students?${params.toString()}&page=1&pageSize=10000&_t=${Date.now()}`
      );
      if (response.ok) {
        const data = await response.json();
        const students = data.data || [];

        // Extract unique classes from students in selected schools
        const classes = Array.from(
          new Set(
            students
              .map((s: any) => s.attributes?.turma || s.turma)
              .filter(Boolean)
          )
        ).sort() as string[];

        setAvailableClasses(classes);
      }
    } catch (err) {
      console.error("Error fetching classes for schools:", err);
    }
  }, [selectedSchools]);

  // Filter available classes based on selected schools
  useEffect(() => {
    if (selectedSchools.length > 0) {
      // Fetch classes for selected schools
      fetchClassesForSchools();
    } else {
      // Show all classes when no schools are selected
      setAvailableClasses(allClasses);
    }
  }, [selectedSchools, allClasses, fetchClassesForSchools]);

  const downloadTemplate = () => {
    const csvContent = `Nome,CPF,Escola,Turma
João Silva,12345678901,Nitro Academy,8º ano
Maria Santos,98765432109,Nitro Academy,9º ano
Pedro Oliveira,11122233344,Outra Escola,7º ano`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_alunos_escola_parceira.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSelectedSchools([]);
    setSelectedClasses([]);
    setEnrollmentStatusFilter("all");
    setCurrentPage(1);
  };

  const refreshData = () => {
    fetchStudents();
    fetchAvailableFilters();
  };

  const exportToPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text(t("pdf_title"), 14, 22);

      // Enrollment summary
      doc.setFontSize(12);
      doc.text(getEnrollmentSummary(), 14, 35);

      // Filters info
      let filterInfo = "";
      if (selectedSchools.length > 0) {
        filterInfo += `Escolas: ${selectedSchools.join(", ")}`;
      }
      if (selectedClasses.length > 0) {
        filterInfo += filterInfo
          ? ` | Turmas: ${selectedClasses.join(", ")}`
          : `Turmas: ${selectedClasses.join(", ")}`;
      }
      if (enrollmentStatusFilter !== "all") {
        const statusText =
          enrollmentStatusFilter === "enrolled"
            ? "Matriculados"
            : "Não Matriculados";
        filterInfo += filterInfo
          ? ` | Status: ${statusText}`
          : `Status: ${statusText}`;
      }

      if (filterInfo) {
        doc.setFontSize(10);
        doc.text(`Filtros aplicados: ${filterInfo}`, 14, 45);
      }

      // Table data
      const tableData = allStudents.map((student) => [
        student.nome,
        student.cpf || "-",
        student.escola,
        student.turma || "-",
        student.isEnrolled ? "Matriculado" : "Não Matriculado",
        student.isEnrolled && student.courseInfo
          ? student.courseInfo.courseName
          : "-",
        student.isEnrolled && student.courseInfo && student.courseInfo.schedule
          ? `${student.courseInfo.schedule.dia_semana || ""} ${
              student.courseInfo.schedule.horario_aula || ""
            }`.trim()
          : "-",
      ]);

      // Table headers
      const headers = [
        t("name"),
        t("cpf"),
        t("school"),
        t("class"),
        t("status"),
        t("course"),
        t("schedule"),
      ];

      // Generate table
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 55,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [59, 130, 246], // Blue color
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Light gray
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Name
          1: { cellWidth: 25 }, // CPF
          2: { cellWidth: 30 }, // School
          3: { cellWidth: 20 }, // Class
          4: { cellWidth: 25 }, // Status
          5: { cellWidth: 35 }, // Course
          6: { cellWidth: 25 }, // Schedule
        },
      });

      // Footer with date
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Gerado em: ${new Date().toLocaleDateString(
            "pt-BR"
          )} - Página ${i} de ${pageCount}`,
          14,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      const fileName = `lista_alunos_nitro${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      setSuccess(t("export_success"));
    } catch (error) {
      console.error("Export error:", error);
      setError(t("export_error"));
    } finally {
      setExporting(false);
    }
  };

  const hasActiveFilters =
    selectedSchools.length > 0 ||
    selectedClasses.length > 0 ||
    enrollmentStatusFilter !== "all";

  // Calculate enrollment summary based on school and class filters
  const getEnrollmentSummary = () => {
    // Get students filtered by school and class
    const filteredStudents = allStudents.filter((student) => {
      // If no schools selected, include all students
      if (selectedSchools.length === 0) return true;
      // If schools selected, only include students from those schools
      return selectedSchools.includes(student.escola);
    });

    const enrolledCount = filteredStudents.filter(
      (student) => student.isEnrolled
    ).length;
    const totalCount = filteredStudents.length;

    // If one school and one class are selected
    if (selectedSchools.length === 1 && selectedClasses.length === 1) {
      return t("enrollment_summary_school_class", {
        school: selectedSchools[0],
        class: selectedClasses[0],
        enrolled: enrolledCount,
        total: totalCount,
      });
    }
    // If only one school is selected
    else if (selectedSchools.length === 1) {
      return t("enrollment_summary_school", {
        school: selectedSchools[0],
        enrolled: enrolledCount,
        total: totalCount,
      });
    } else {
      return t("enrollment_summary", {
        enrolled: enrolledCount,
        total: totalCount,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-2">{t("description")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {t("import_section")}
          </CardTitle>
          <CardDescription>{t("import_description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {importing ? t("importing") : t("import_csv")}
            </Button>

            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {t("download_template")}
            </Button>
          </div>

          {importing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{importStatus}</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="text-sm text-gray-600">
            <p>
              <strong>{t("required_columns")}:</strong> Nome, Escola
            </p>
            <p>
              <strong>{t("optional_columns")}:</strong> CPF, Turma
            </p>
            <p>
              <strong>{t("file_format")}:</strong> CSV (UTF-8)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t("students_list")} ({totalStudents})
                {hasActiveFilters && (
                  <span className="text-sm text-gray-500">filtrados</span>
                )}
              </CardTitle>
              <CardDescription>{t("students_description")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                {t("refresh")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {t("filters")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                disabled={exporting || allStudents.length === 0}
                className="flex items-center gap-2"
              >
                <FileDown
                  className={`w-4 h-4 ${exporting ? "animate-spin" : ""}`}
                />
                {exporting ? t("exporting") : t("export_pdf")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters Section */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{t("filters")}</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-4 h-4" />
                    {t("clear_filters")}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("school")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSchools.map((school) => (
                      <button
                        key={school}
                        onClick={() => {
                          setSelectedSchools((prev) =>
                            prev.includes(school)
                              ? prev.filter((s) => s !== school)
                              : [...prev, school]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedSchools.includes(school)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {school}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("class")}
                    </label>
                    {selectedSchools.length > 0 && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {t("filtered_by_schools")}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableClasses.map((classItem) => (
                      <button
                        key={classItem}
                        onClick={() => {
                          setSelectedClasses((prev) =>
                            prev.includes(classItem)
                              ? prev.filter((c) => c !== classItem)
                              : [...prev, classItem]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedClasses.includes(classItem)
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {classItem}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("enrollment_status")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "all", label: "Todos", color: "bg-gray-600" },
                      {
                        value: "enrolled",
                        label: "Matriculados",
                        color: "bg-green-600",
                      },
                      {
                        value: "not_enrolled",
                        label: "Não Matriculados",
                        color: "bg-red-600",
                      },
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={() => setEnrollmentStatusFilter(status.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          enrollmentStatusFilter === status.value
                            ? `${status.color} text-white`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">{t("loading")}</p>
            </div>
          ) : allStudents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t("no_students")}</p>
              <p className="text-sm text-gray-500 mt-2">
                {t("import_to_get_started")}
              </p>
            </div>
          ) : (
            <>
              {/* Enrollment Summary */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  {getEnrollmentSummary()}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        {t("name")}
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        {t("cpf")}
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        {t("school")}
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        {t("class")}
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        {t("status")}
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        {t("course")}
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        {t("schedule")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">
                          {student.nome}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {student.cpf || "-"}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {student.escola}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {student.turma || "-"}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              student.isEnrolled
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.isEnrolled
                              ? "Matriculado"
                              : "Não Matriculado"}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {student.isEnrolled && student.courseInfo ? (
                            <span className="font-medium text-gray-900">
                              {student.courseInfo.courseName}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {student.isEnrolled &&
                          student.courseInfo &&
                          student.courseInfo.schedule ? (
                            <div className="text-sm text-gray-600">
                              {student.courseInfo.schedule.dia_semana && (
                                <span>
                                  {student.courseInfo.schedule.dia_semana}
                                </span>
                              )}
                              {student.courseInfo.schedule.dia_semana &&
                                student.courseInfo.schedule.horario_aula && (
                                  <span> • </span>
                                )}
                              {student.courseInfo.schedule.horario_aula && (
                                <span>
                                  {student.courseInfo.schedule.horario_aula}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    {t("pagination.showing", {
                      start: (currentPage - 1) * studentsPerPage + 1,
                      end: Math.min(
                        currentPage * studentsPerPage,
                        totalStudents
                      ),
                      total: totalStudents,
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t("pagination.previous")}
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {t("pagination.next")}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
