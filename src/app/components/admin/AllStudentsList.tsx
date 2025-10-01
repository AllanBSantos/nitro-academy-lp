"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Download, RefreshCw, Search, Filter, X } from "lucide-react";
import StudentsReport from "./StudentsReport";
import { normalizeName, formatPhone } from "@/lib/formatters";

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
  escola_parceira?: string;
  turma?: number;
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

  // Estados para filtros
  const [searchName, setSearchName] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [availableSchools, setAvailableSchools] = useState<string[]>([]);

  const fetchAlunos = async () => {
    setLoading(true);
    setError(null);

    try {
      const timestamp = new Date().getTime();
      const randomId = Math.random().toString(36).substring(7);

      // Construir parâmetros de query
      const params = new URLSearchParams({
        t: timestamp.toString(),
        r: randomId,
      });

      if (debouncedSearchName) {
        params.append("search", debouncedSearchName);
      }
      if (selectedCourse) {
        params.append("curso", selectedCourse);
      }
      if (selectedSchool) {
        params.append("escola", selectedSchool);
      }

      const response = await fetch(
        `/api/admin/all-students?${params.toString()}`,
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
  }, [debouncedSearchName, selectedCourse, selectedSchool]);

  // Debounce para o campo de pesquisa
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchName(searchName);
    }, 500); // Aguarda 500ms após parar de digitar

    return () => clearTimeout(timer);
  }, [searchName]);

  // Função para buscar opções de filtro
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch("/api/admin/all-students");
      const result = await response.json();

      if (response.ok && result.data) {
        // Extrair cursos únicos
        const courses = Array.from(
          new Set(
            result.data.flatMap((aluno: AlunoHabilitado) =>
              aluno.cursos.map((curso) => curso.titulo)
            )
          )
        ).sort();

        // Extrair escolas únicas
        const schools = Array.from(
          new Set(
            result.data
              .map((aluno: AlunoHabilitado) => aluno.escola_parceira)
              .filter(Boolean)
          )
        ).sort();

        setAvailableCourses(courses);
        setAvailableSchools(schools);
      }
    } catch (err) {
      console.error("Erro ao buscar opções de filtro:", err);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchName("");
    setDebouncedSearchName("");
    setSelectedCourse("");
    setSelectedSchool("");
  };

  const hasActiveFilters =
    debouncedSearchName || selectedCourse || selectedSchool;

  const downloadCSV = () => {
    if (!alunos.length) return;

    const headers = [
      "Nome do Aluno",
      "Telefone do Aluno",
      "Nome do Responsável",
      "Telefone do Responsável",
      "Cursos",
      "Escola Parceira",
      "Turma",
    ];

    const csvContent = [
      headers.join(","),
      ...alunos.map((aluno) =>
        [
          `"${normalizeName(aluno.nome)}"`,
          `"${aluno.telefone_aluno ? formatPhone(aluno.telefone_aluno) : ""}"`,
          `"${normalizeName(aluno.responsavel)}"`,
          `"${formatPhone(aluno.telefone_responsavel)}"`,
          `"${aluno.cursos.map((c) => c.titulo).join("; ")}"`,
          `"${aluno.escola_parceira || ""}"`,
          `"${aluno.turma || ""}"`,
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
                  {hasActiveFilters && (
                    <span className="text-sm text-gray-500">(filtrados)</span>
                  )}
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
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
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
            {/* Filtros */}
            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Filtros</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                      Limpar filtros
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pesquisa por nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesquisar por nome
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Digite o nome do aluno..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Filtro por curso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por curso
                    </label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todos os cursos</option>
                      {availableCourses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por escola */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por escola
                    </label>
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todas as escolas</option>
                      {availableSchools.map((school) => (
                        <option key={school} value={school}>
                          {school}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

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
                <p className="text-gray-500">
                  {hasActiveFilters
                    ? "Nenhum aluno encontrado com os filtros aplicados"
                    : t("no_students_found")}
                </p>
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
                      <th className="text-left py-3 px-4 font-medium">
                        Escola Parceira
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Turma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map((aluno) => (
                      <tr key={aluno.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {normalizeName(aluno.nome)}
                        </td>
                        <td className="py-3 px-4">
                          {aluno.telefone_aluno
                            ? formatPhone(aluno.telefone_aluno)
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          {normalizeName(aluno.responsavel)}
                        </td>
                        <td className="py-3 px-4">
                          {formatPhone(aluno.telefone_responsavel)}
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
                        <td className="py-3 px-4">
                          {aluno.escola_parceira || "-"}
                        </td>
                        <td className="py-3 px-4">{aluno.turma || "-"}</td>
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
