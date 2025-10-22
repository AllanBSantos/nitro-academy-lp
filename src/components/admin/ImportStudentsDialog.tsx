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

export function ImportStudentsDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleImport = () => {
    if (file) {
      console.log("Importing file:", file.name);
      // Mock import logic
      setFile(null);
    }
  };

  const handleDownloadTemplate = () => {
    console.log("Downloading template...");
    // Mock download template logic
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
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#599fe9] text-white rounded-lg hover:bg-[#599fe9]/90 transition-colors">
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
              className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file}
              className="flex-1 h-11 bg-[#f54a12] hover:bg-[#f54a12]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
