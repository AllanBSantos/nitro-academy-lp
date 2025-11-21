import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../new-layout/ui/dialog";
import { Button } from "../new-layout/ui/button";
import { Upload, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Card } from "../new-layout/ui/card";
import Papa from "papaparse";

export function ImportStudentsDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const parseCsvFile = (csvFile: File): Promise<
    Array<{
      nome: string;
      cpf: string;
      escola: string;
      turma: string;
    }>
  > =>
    new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          const { data, errors } = results;
          if (errors.length > 0) {
            reject(new Error("Erro ao processar o CSV. Verifique o arquivo."));
            return;
          }

          const normalizedRows = (data as Record<string, string>[])
            .map((row) => {
              const normalized: Record<string, string> = {};
              Object.keys(row).forEach((key) => {
                normalized[key.trim().toLowerCase()] = row[key];
              });

              const nome =
                normalized["nome"] || row["Nome"] || row["NOME"] || "";
              const escola =
                normalized["escola"] || row["Escola"] || row["ESCOLA"] || "";
              const cpf =
                normalized["cpf"] || row["CPF"] || row["cpf "] || "";
              const turma =
                normalized["turma"] || row["Turma"] || row["TURMA"] || "";

              return {
                nome: nome?.trim() || "",
                escola: escola?.trim() || "",
                cpf: cpf?.trim() || "",
                turma: turma?.trim() || "",
              };
            })
            .filter((row) => row.nome && row.escola);

          if (!normalizedRows.length) {
            reject(
              new Error(
                "Não foram encontradas linhas válidas. Verifique as colunas Nome e Escola."
              )
            );
            return;
          }

          resolve(normalizedRows);
        },
        error: () => {
          reject(new Error("Erro ao ler o arquivo CSV."));
        },
      });
    });

  const uploadBatch = async (batch: unknown[]) => {
    const response = await fetch("/api/partner-students/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: batch }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result?.error ||
          result?.message ||
          "Erro ao importar alunos. Verifique o arquivo."
      );
    }

    return result;
  };

  const handleImport = async () => {
    if (!file) {
      setImportError("Selecione um arquivo CSV para continuar.");
      return;
    }

    setImporting(true);
    setImportProgress(0);
    setImportStatus("Lendo arquivo...");
    setImportError(null);
    setImportSuccess(null);

    try {
      const rows = await parseCsvFile(file);

      const BATCH_SIZE = 20;
      let importedTotal = 0;
      const collectedErrors: string[] = [];

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        setImportStatus(
          `Importando alunos ${Math.min(i + 1, rows.length)}-${Math.min(
            i + batch.length,
            rows.length
          )} de ${rows.length}`
        );

        const result = await uploadBatch(batch);
        importedTotal += result.imported || 0;
        if (Array.isArray(result.errors)) {
          collectedErrors.push(...result.errors.filter(Boolean));
        }

        const progress = Math.round(((i + batch.length) / rows.length) * 100);
        setImportProgress(progress);
      }

      setImportStatus("Importação concluída.");
      setImportSuccess(
        `${importedTotal} aluno(s) importado(s) com sucesso${
          collectedErrors.length ? " (alguns registros não foram importados)." : "."
        }`
      );
      if (collectedErrors.length) {
        setImportError(collectedErrors.join(" | "));
      }
      setFile(null);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Erro ao importar alunos."
      );
    } finally {
      setImporting(false);
      setImportProgress((prev) => (prev === 0 ? prev : 100));
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "Nome,Escola,CPF,Turma\n" +
      "Alice Souza,Colégio Nitro,12345678900,8º A\n" +
      "Bruno Lima,Escola Horizonte,98765432100,9º B\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_alunos_escola_parceira.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#599fe9] hover:bg-[#599fe9]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#599fe9]/20">
          <Upload className="w-5 h-5 mr-2" />
          Importar Alunos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 flex items-center gap-2">
            <Upload className="w-6 h-6 text-[#599fe9]" />
            Importar Lista de Alunos
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Faça upload de um arquivo CSV com a lista de alunos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? "border-[#599fe9] bg-[#599fe9]/5"
                : "border-gray-300 hover:border-[#599fe9] hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-[#599fe9]/10 rounded-full">
                <FileSpreadsheet className="w-8 h-8 text-[#599fe9]" />
              </div>
              
              {file ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                    className="mt-2"
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-gray-900 mb-1">
                      Arraste e solte seu arquivo CSV aqui
                    </p>
                    <p className="text-sm text-gray-500">ou</p>
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#599fe9] bg-white text-[#599fe9] hover:bg-[#599fe9]/10 transition-colors">
                      <Upload className="w-4 h-4" />
                      Selecionar Arquivo
                    </span>
                  </label>
                  <p className="text-xs text-gray-500">Formato: CSV (UTF-8)</p>
                </>
              )}
            </div>
          </div>

          {/* Information Card */}
          <Card className="bg-blue-50 border-blue-200 p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-900">
                    <span className="font-medium">Colunas obrigatórias:</span> Nome, Escola
                  </p>
                </div>
                <div>
                  <p className="text-gray-900">
                    <span className="font-medium">Colunas opcionais:</span> CPF, Turma
                  </p>
                </div>
                <div>
                  <p className="text-gray-900">
                    <span className="font-medium">Formato do arquivo:</span> CSV (UTF-8)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="flex-1 h-11 border-[#d8deff] bg-white text-[#1f235a] hover:bg-[#f4f6ff]"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1 h-11 bg-[#f54a12] hover:bg-[#f54a12]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? "Importando..." : "Importar CSV"}
            </Button>
          </div>

          {(importStatus || importProgress > 0 || importError || importSuccess) && (
            <div className="space-y-2 text-sm">
              {importProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#599fe9] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              )}
              {importStatus && (
                <p className="text-gray-600 font-medium">{importStatus}</p>
              )}
              {importSuccess && (
                <p className="text-green-600 font-medium">{importSuccess}</p>
              )}
              {importError && (
                <p className="text-red-600">
                  <strong>Erros:</strong> {importError}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
