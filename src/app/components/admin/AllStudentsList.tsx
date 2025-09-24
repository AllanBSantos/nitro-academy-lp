"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Download, RefreshCw } from "lucide-react";
import StudentsReport from "./StudentsReport";

interface AlunoHabilitado {
  id: number;
  nome: string;
  telefone_aluno?: string;
  responsavel: string;
  telefone_responsavel: string;
  cursos: Array<{
    id: number;
    titulo: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AllStudentsList() {
  const t = useTranslations("Admin.allStudentsList");
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState<AlunoHabilitado[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all-students" | "unlinked-students"
  >("all-students");

  const fetchAlunos = async () => {
    setLoading(true);
    setError(null);

    try {
      const timestamp = new Date().getTime();
      const randomId = Math.random().toString(36).substring(7);
      const response = await fetch(
        `/api/admin/all-students?t=${timestamp}&r=${randomId}`,
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
        throw new Error(result.error || "Erro ao carregar lista de alunos");
      }

      setAlunos(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const downloadCSV = () => {
    if (!alunos.length) return;

    const headers = [
      "Nome do Aluno",
      "Telefone do Aluno",
      "Nome do Responsável",
      "Telefone do Responsável",
      "Cursos",
    ];

    const csvContent = [
      headers.join(","),
      ...alunos.map((aluno) =>
        [
          `"${aluno.nome}"`,
          `"${aluno.telefone_aluno || ""}"`,
          `"${aluno.responsavel}"`,
          `"${aluno.telefone_responsavel}"`,
          `"${aluno.cursos.map((c) => c.titulo).join("; ")}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `alunos_habilitados_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("all-students")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all-students"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {t("all_students_tab")}
          </button>
          <button
            onClick={() => setActiveTab("unlinked-students")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "unlinked-students"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {t("unlinked_students_tab")}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "all-students" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{t("title")}</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{t("description")}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={fetchAlunos}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  {t("refresh")}
                </Button>
                <Button
                  onClick={downloadCSV}
                  variant="outline"
                  size="sm"
                  disabled={!alunos.length}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("download_csv")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">{error}</div>
                <Button onClick={fetchAlunos} variant="outline">
                  {t("try_again")}
                </Button>
              </div>
            ) : alunos.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t("no_students_found")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        {t("student_name")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        {t("student_phone")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        {t("responsible_name")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        {t("responsible_phone")}
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        {t("courses")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map((aluno) => (
                      <tr key={aluno.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{aluno.nome}</td>
                        <td className="py-3 px-4">
                          {aluno.telefone_aluno || "-"}
                        </td>
                        <td className="py-3 px-4">{aluno.responsavel}</td>
                        <td className="py-3 px-4">
                          {aluno.telefone_responsavel}
                        </td>
                        <td className="py-3 px-4">
                          {aluno.cursos.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {aluno.cursos.map((curso) => (
                                <span
                                  key={curso.id}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {curso.titulo}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "unlinked-students" && <StudentsReport />}
    </div>
  );
}
