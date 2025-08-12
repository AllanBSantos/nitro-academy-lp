"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Download,
  RefreshCw,
  AlertTriangle,
  Users,
  Clock,
  BookOpen,
  FileDown,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

interface AlunoExcedente {
  id: number;
  documentId: string;
  nome: string;
  email: string;
  responsavel: string;
  telefone: string;
  createdAt: string;
  habilitado: boolean;
  escola?: string;
}

interface CursoComExcedentes {
  cursoId: number;
  titulo: string;
  slug: string;
  nivel: string;
  totalAlunos: number;
  alunosMatriculados: number;
  alunosExcedentes: number;
  listaExcedentes: AlunoExcedente[];
}

interface ExceededReportData {
  cursosComExcedentes: CursoComExcedentes[];
  totalExcedentes: number;
  totalAlunosHabilitados: number;
  percentualExcedentes: number;
}

// Extend jsPDF interface for autoTable
interface ExtendedJsPDF extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export default function ExceededStudentsReport() {
  const t = useTranslations("Admin.exceededStudentsReport");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState<ExceededReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const timestamp = new Date().getTime();
      const randomId = Math.random().toString(36).substring(7);
      const response = await fetch(
        `/api/admin/exceeded-students-report?t=${timestamp}&r=${randomId}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao carregar relatório");
      }

      setReportData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const downloadCSV = () => {
    if (!reportData?.cursosComExcedentes) return;

    const headers = [
      "Curso",
      "Total Alunos",
      "Alunos Matriculados",
      "Alunos Excedentes",
      "Nome do Aluno",
      "Escola",
      "Telefone",
      "Data de Inscrição",
    ];

    const csvRows = [headers];

    reportData.cursosComExcedentes.forEach((curso) => {
      curso.listaExcedentes.forEach((aluno) => {
        const dataInscricao = new Date(aluno.createdAt).toLocaleDateString(
          "pt-BR"
        );
        csvRows.push([
          curso.titulo,
          curso.totalAlunos.toString(),
          curso.alunosMatriculados.toString(),
          curso.alunosExcedentes.toString(),
          aluno.nome,
          aluno.escola || "",
          aluno.telefone,
          dataInscricao,
        ]);
      });
    });

    const csvContent = csvRows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `alunos_excedentes_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!reportData?.cursosComExcedentes) return;

    setExporting(true);
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text("Relatório de Alunos Excedentes", 14, 22);

      // Subtitle
      doc.setFontSize(12);
      doc.text("Cursos que excederam o limite de 15 alunos", 14, 32);

      // Statistics
      doc.setFontSize(10);
      doc.text(
        `Total de alunos excedentes: ${reportData.totalExcedentes}`,
        14,
        42
      );
      doc.text(
        `Cursos com excedentes: ${reportData.cursosComExcedentes.length}`,
        14,
        48
      );
      doc.text(
        `Percentual de excedentes: ${reportData.percentualExcedentes.toFixed(
          1
        )}%`,
        14,
        54
      );

      // Date
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 64);

      let currentY = 80;

      // Process each course
      reportData.cursosComExcedentes.forEach((curso, index) => {
        // Course header
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${curso.titulo}`, 14, currentY);
        currentY += 8;

        // Course statistics
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Total de alunos: ${curso.totalAlunos} | Matriculados: ${curso.alunosMatriculados} | Excedentes: ${curso.alunosExcedentes}`,
          14,
          currentY
        );
        currentY += 12;

        // Check if we need a new page
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }

        // Table headers
        const headers = [
          "#",
          "Nome do Aluno",
          "Escola",
          "Telefone",
          "Data de Inscrição",
        ];

        // Table data
        const tableData = curso.listaExcedentes.map((aluno, alunoIndex) => [
          (alunoIndex + 1).toString(),
          aluno.nome,
          aluno.escola || "",
          aluno.telefone,
          new Date(aluno.createdAt).toLocaleDateString("pt-BR"),
        ]);

        // Generate table
        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: currentY,
          styles: {
            fontSize: 8,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [220, 38, 38], // Red color for exceeded students
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [254, 242, 242], // Light red
          },
          columnStyles: {
            0: { cellWidth: 10 }, // #
            1: { cellWidth: 55 }, // Name
            2: { cellWidth: 35 }, // School
            3: { cellWidth: 30 }, // Phone
            4: { cellWidth: 25 }, // Date
          },
        });

        const finalY = (doc as ExtendedJsPDF).lastAutoTable?.finalY;
        currentY = finalY ? finalY + 15 : currentY + 15;

        // Check if we need a new page for the next course
        if (
          currentY > 250 &&
          index < reportData.cursosComExcedentes.length - 1
        ) {
          doc.addPage();
          currentY = 20;
        }
      });

      // Footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${pageCount}`,
          14,
          doc.internal.pageSize.height - 10
        );
      }

      // Save the PDF
      const fileName = `alunos_excedentes_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Export error:", error);
      setError("Erro ao exportar PDF");
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR") +
      " às " +
      date.toLocaleTimeString("pt-BR")
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-600">
            {t("loading")}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("error.title")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={fetchReport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("error.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-1">
            Cursos que excederam o limite de 15 alunos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchReport}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("actions.refresh")}
          </Button>
          <Button
            onClick={downloadCSV}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {t("actions.export_csv")}
          </Button>
          <Button
            onClick={exportToPDF}
            disabled={exporting || !reportData?.cursosComExcedentes?.length}
            className="bg-red-600 hover:bg-red-700"
          >
            <FileDown
              className={`w-4 h-4 mr-2 ${exporting ? "animate-spin" : ""}`}
            />
            {exporting ? t("exporting") : t("actions.export_pdf")}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("stats.total_exceeded")}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {reportData.totalExcedentes}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("stats.exceeded_percentage", {
                  percentage: reportData.percentualExcedentes.toFixed(1),
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("stats.courses_with_exceeded")}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {reportData.cursosComExcedentes.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("stats.courses_exceeded_limit")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("stats.enabled_students")}
              </CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {reportData.totalAlunosHabilitados}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("stats.total_students_system")}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Courses with Exceeded Students */}
      {reportData && reportData.cursosComExcedentes.length > 0 ? (
        <div className="space-y-6">
          {reportData.cursosComExcedentes.map((curso) => (
            <Card key={curso.cursoId} className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold">
                      {curso.titulo}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {curso.alunosExcedentes}
                    </div>
                    <div className="text-sm text-gray-500">
                      excedentes de {curso.totalAlunos} alunos
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📊 Total: {curso.totalAlunos} alunos</span>
                    <span>
                      ✅ Matriculados: {curso.alunosMatriculados} alunos
                    </span>
                    <span>🚨 Excedentes: {curso.alunosExcedentes} alunos</span>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Alunos Excedentes (ordem de inscrição):
                    </h4>
                    <div className="space-y-3">
                      {curso.listaExcedentes.map((aluno, alunoIndex) => (
                        <div
                          key={aluno.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {alunoIndex + 1}. {aluno.nome}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Telefone: </span>
                                {aluno.telefone}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">
                                  {t("student.school")}:{" "}
                                </span>
                                {aluno.escola || "-"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                <Clock className="w-4 h-4 inline mr-1" />
                                {formatDate(aluno.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("no_exceeded.title")}
              </h3>
              <p className="text-gray-600">{t("no_exceeded.description")}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
