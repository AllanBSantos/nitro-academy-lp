/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import {
  Upload,
  Download,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Papa from "papaparse";

interface PartnerStudent {
  id: number;
  nome: string;
  cpf: string;
  escola: string;
  turma: string;
  data_importacao?: string;
}

// ========= NOVO: tamanho de lote para importação ========= //
const BATCH_SIZE = 40; // ajuste conforme performance do backend
// ========================================================= //

export default function PartnerStudentsList() {
  const t = useTranslations("Admin.partnerStudents");
  const [students, setStudents] = useState<PartnerStudent[]>([]);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const studentsPerPage = 100;

  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState("");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
      complete: (results) => {
        const { data, errors } = results;

        if (errors.length > 0) {
          setError(t("csv_parse_error"));
          return;
        }

        const requiredColumns = ["Nome", "Escola"];
        const firstRow = data[0] as any;

        for (const column of requiredColumns) {
          if (!(column in firstRow)) {
            setError(t("missing_columns", { columns: requiredColumns.join(", ") }));
            return;
          }
        }

        const csvData = data.map((row: any) => ({
          nome: row.Nome,
          cpf: row.CPF || "",
          escola: row.Escola,
          turma: row.Turma || "",
        }));

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
        if (prev >= 90) return 90; // deixamos 10% para finalizar
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

  // ==============================
  // NOVO: importação em lotes
  // ==============================
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
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min safety

        const response = await fetch("/api/partner-students/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: batch }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Garantimos que a resposta realmente seja JSON
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

        index += BATCH_SIZE;

        // Avança progress bar proporcional até 90%
        setImportProgress(Math.min(90, Math.round((index / csvData.length) * 90)));
        setImportStatus(
          t("import_status_progress", {
            current: totalImported,
            total: csvData.length,
          })
        );

        // Pequeno delay para evitar sobrecarga no backend
        await delay(500);
      }

      // Finalização
      setImportProgress(100);
      setImportStatus(t("import_status_completed"));

      setTimeout(() => {
        setSuccess(t("import_success", { count: totalImported }));
        if (allErrors.length > 0) {
          setError(t("import_warnings", { errors: allErrors.join(", ") }));
        }
        fetchStudents();
      }, 500);
    } catch (err: any) {
      console.error("Import error:", err);

      if (err.name === "AbortError") {
        setError(t("import_timeout"));
      } else {
        setError(err.message || t("import_error"));
      }
      fetchStudents();
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
      const response = await fetch(`/api/partner-students?page=${currentPage}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data || []);
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

  const downloadTemplate = () => {
    const csvContent = "Nome,CPF,Escola,Turma";
    const blob = new Blob([csvContent], { type: "text/csv" });
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

  const startIndex = (currentPage - 1) * studentsPerPage + 1;
  const endIndex = Math.min(currentPage * studentsPerPage, totalStudents);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-2">{t("description")}</p>
        </div>
      </div>

      {/* ==================== Seção de Importação ==================== */}
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

      {/* ==================== Lista de Alunos ==================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("students_list")} ({totalStudents})
          </CardTitle>
          <CardDescription>{t("students_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">{t("loading")}</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t("no_students")}</p>
              <p className="text-sm text-gray-500 mt-2">{t("import_to_get_started")}</p>
            </div>
          ) : (
            <>
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
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{student.nome}</td>
                        <td className="border border-gray-200 px-4 py-2">{student.cpf || "-"}</td>
                        <td className="border border-gray-200 px-4 py-2">{student.escola}</td>
                        <td className="border border-gray-200 px-4 py-2">{student.turma || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    {t("pagination.showing", {
                      start: startIndex,
                      end: endIndex,
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
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
