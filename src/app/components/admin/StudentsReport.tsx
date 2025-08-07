"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  RefreshCw,
  AlertTriangle,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportData {
  alunos: Aluno[];
  total: number;
  totalAlunosStrapi: number;
  totalAlunosParceiros: number;
}

export default function StudentsReport() {
  const t = useTranslations("Admin.studentsReport");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cache busting mais robusto
      const timestamp = new Date().getTime();
      const randomId = Math.random().toString(36).substring(7);
      const response = await fetch(
        `/api/admin/students-report?t=${timestamp}&r=${randomId}`,
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
    if (!reportData?.alunos) return;

    const headers = ["Nome"];
    const csvContent = [
      headers.join(","),
      ...reportData.alunos.map((aluno) => [`"${aluno.nome}"`].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `alunos_nao_parceiros_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchReport} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("try_again")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-1">{t("description")}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchReport} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("refresh")}
          </Button>
          {reportData && reportData.total > 0 && (
            <Button onClick={downloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              {t("download_csv")}
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("total_strapi_students")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.totalAlunosStrapi}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("total_partner_students")}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.totalAlunosParceiros}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("non_partner_students")}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {reportData.total}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students List */}
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>{t("students_list")}</CardTitle>
            <p className="text-sm text-gray-600">
              {reportData.total === 0
                ? t("no_students_found")
                : t("showing_count", { count: reportData.total })}
            </p>
          </CardHeader>
          <CardContent>
            {reportData.total === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {t("all_students_are_partners")}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        {t("name")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.alunos.map((aluno) => (
                      <tr key={aluno.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{aluno.nome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
