import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  File,
  FileType,
  Presentation,
  Image as ImageIcon,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  Inbox,
} from "lucide-react";
import { Button } from "../new-layout/ui/button";
import { Card } from "../new-layout/ui/card";
import { Input } from "../new-layout/ui/input";
import { Textarea } from "../new-layout/ui/textarea";
import { Checkbox } from "../new-layout/ui/checkbox";
import { Avatar, AvatarFallback } from "../new-layout/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../new-layout/ui/table";
import { toast } from "sonner";
import { StudentCommentDialog } from "./StudentCommentDialog";
import { ADMIN_TOKEN } from "@/lib/constants";

// Helper para construir URL completa do arquivo do Strapi
// Usa proxy do Next.js para evitar problemas de CORS
const getFileUrl = (url: string): string => {
  if (!url) return "";

  // Se já é uma URL completa (http:// ou https://), usar proxy
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Extrair o caminho relativo da URL completa
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      return `/api/files${path}`;
    } catch {
      return url;
    }
  }

  // Se começa com /, usar proxy do Next.js
  if (url.startsWith("/")) {
    return `/api/files${url}`;
  }

  // Caso contrário, retornar como está
  return url;
};

// Componente para imagem com fallback
const ImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-[#599fe9]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

// Helper para renderizar ícone ou miniatura baseado no tipo de arquivo
const renderFileIcon = (material: Material) => {
  const mimeType = material.mime?.toLowerCase() || "";
  const fileName = material.name?.toLowerCase() || "";
  const fileUrl = material.url || "";

  // Verificar se é imagem
  if (
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(fileName)
  ) {
    return (
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <ImageWithFallback src={fileUrl} alt={material.name} />
      </div>
    );
  }

  // Verificar se é PDF
  if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
    return (
      <div className="p-2 bg-red-50 rounded-lg">
        <File className="w-6 h-6 text-red-600" />
      </div>
    );
  }

  // Verificar se é DOC/DOCX (Word)
  if (
    mimeType.includes("word") ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    /\.(doc|docx)$/i.test(fileName)
  ) {
    return (
      <div className="p-2 bg-blue-50 rounded-lg">
        <FileText className="w-6 h-6 text-blue-600" />
      </div>
    );
  }

  // Verificar se é PPT/PPTX (PowerPoint)
  if (
    mimeType.includes("presentation") ||
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    /\.(ppt|pptx)$/i.test(fileName)
  ) {
    return (
      <div className="p-2 bg-orange-50 rounded-lg">
        <Presentation className="w-6 h-6 text-orange-600" />
      </div>
    );
  }

  // Ícone genérico para outros arquivos
  return (
    <div className="p-2 bg-[#599fe9]/10 rounded-lg">
      <FileType className="w-6 h-6 text-[#599fe9]" />
    </div>
  );
};

interface ClassDetailsProps {
  classItem: {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    description: string;
  };
  courseId: number;
  onBack: () => void;
}

interface StudentAttendance {
  id: number;
  name: string;
  present: boolean;
  spinners: number;
  comment: string;
}

interface Material {
  id: number;
  name: string;
  type: string;
  uploadedAt: string;
  url?: string;
  mime?: string;
  size?: number;
}

export function ClassDetails({
  classItem,
  courseId,
  onBack,
}: ClassDetailsProps) {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [notes, setNotes] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [resolvedDocumentId, setResolvedDocumentId] = useState(
    classItem.id?.toString() ?? ""
  );
  const [resolvedNumericId, setResolvedNumericId] = useState<string | null>(
    null
  );
  const t = useTranslations("Admin.panel.class_details");

  useEffect(() => {
    if (!saveMessage) return;
    const timeout = setTimeout(() => setSaveMessage(""), 4000);
    return () => clearTimeout(timeout);
  }, [saveMessage]);

  const resolveAlunoId = (entry: any): number | null => {
    if (!entry || entry === null) return null;
    if (typeof entry.aluno === "number") return entry.aluno;
    if (typeof entry.aluno === "string")
      return Number.parseInt(entry.aluno, 10) || null;
    if (entry.aluno?.id) return entry.aluno.id;
    if (entry.aluno?.data?.id) return entry.aluno.data.id;
    return null;
  };

  const mapAulaStudents = useCallback(
    (baseStudents: StudentAttendance[], aula: any): StudentAttendance[] => {
      const aulaStudents = Array.isArray(aula?.alunos) ? aula.alunos : [];
      const aulaMap = new Map<
        number,
        { comentario: string; spinners: number }
      >();

      aulaStudents.forEach((entry: any) => {
        const alunoId = resolveAlunoId(entry);
        if (!alunoId) return;
        aulaMap.set(alunoId, {
          comentario: entry.comentario || "",
          spinners: entry.spinners_aula ?? 0,
        });
      });

      return baseStudents.map((student) => {
        const aulaInfo = aulaMap.get(student.id);
        if (aulaInfo) {
          return {
            ...student,
            present: true,
            comment: aulaInfo.comentario,
            spinners: aulaInfo.spinners,
          };
        }
        return {
          ...student,
          present: false,
          spinners: 0,
          comment: "",
        };
      });
    },
    []
  );

  const handlePresenceToggle = (studentId: number) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              present: !student.present,
              spinners: student.present ? 0 : student.spinners,
            }
          : student
      )
    );
  };

  const handleSpinnersChange = (studentId: number, value: number) => {
    if (value >= 0 && value <= 33) {
      setStudents(
        students.map((student) =>
          student.id === studentId ? { ...student, spinners: value } : student
        )
      );
    }
  };

  const handleCommentChange = (studentId: number, comment: string) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, comment } : student
      )
    );
  };

  const formatMaterialsFromAula = useCallback(
    (aula: any): Material[] => {
      // Tentar diferentes estruturas de dados do Strapi
      let arquivosArray: any[] = [];

      if (aula?.arquivos?.data && Array.isArray(aula.arquivos.data)) {
        arquivosArray = aula.arquivos.data;
      } else if (aula?.arquivos && Array.isArray(aula.arquivos)) {
        arquivosArray = aula.arquivos;
      } else if (
        aula?.attributes?.arquivos?.data &&
        Array.isArray(aula.attributes.arquivos.data)
      ) {
        arquivosArray = aula.attributes.arquivos.data;
      }

      if (arquivosArray.length === 0) {
        return [];
      }

      return arquivosArray.map((arq: any) => {
        const attributes = arq.attributes ?? {};
        const id = arq.id ?? attributes.id ?? arq.documentId;
        const name =
          arq.name ||
          attributes.name ||
          arq.attributes?.name ||
          t("materials.default_file_name");
        const mime = arq.mime || attributes.mime || arq.attributes?.mime || "";
        const url = arq.url || attributes.url || arq.attributes?.url || "";
        const createdAt =
          arq.createdAt || attributes.createdAt || arq.attributes?.createdAt;
        const size = arq.size || attributes.size || arq.attributes?.size;

        return {
          id: id,
          name,
          type:
            mime?.split("/")[1]?.toUpperCase() ||
            name.split(".").pop()?.toUpperCase() ||
            "FILE",
          uploadedAt: createdAt
            ? new Date(createdAt).toLocaleString("pt-BR")
            : "",
          url: getFileUrl(url),
          mime,
          size,
        };
      });
    },
    [t]
  );

  // Carregar dados da aula e alunos do curso
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const aulaId = `${classItem.id}`.toString().replace(/\/+$/, "");

        // buscar alunos do curso
        const studentsResponse = await fetch(
          `/api/admin/all-students?cursoId=${courseId}`
        );
        const studentsData = studentsResponse.ok
          ? await studentsResponse.json()
          : { data: [] };

        const baseStudents: StudentAttendance[] = (studentsData.data || []).map(
          (aluno: any) => ({
            id: aluno.id,
            name: aluno.nome || "",
            present: false,
            spinners: 0,
            comment: "",
          })
        );

        // buscar dados completos da aula
        const aulaResponse = await fetch(`/api/aulas/${aulaId}`);
        if (!aulaResponse.ok) {
          throw new Error(t("load_error"));
        }
        const aulaData = await aulaResponse.json();
        const aula = aulaData.data;

        if (aula?.documentId) {
          setResolvedDocumentId(aula.documentId);
        }
        if (aula?.id) {
          setResolvedNumericId(aula.id.toString());
        }

        if (aula?.anotacoes) {
          setNotes(aula.anotacoes);
        } else {
          setNotes("");
        }

        const formattedMaterials = formatMaterialsFromAula(aula);
        setMaterials(formattedMaterials);

        const mergedStudents = mapAulaStudents(baseStudents, aula);
        setStudents(mergedStudents);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error(t("load_error"));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [classItem.id, courseId, formatMaterialsFromAula, mapAulaStudents, t]);

  const getRequestAulaId = () =>
    (resolvedDocumentId ?? classItem.id ?? resolvedNumericId ?? "")
      .toString()
      .replace(/\/+$/, "");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const aulaId = getRequestAulaId();

      try {
        // Enviar todos os arquivos de uma vez
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files[]", file);
        });

        const response = await fetch(`/api/aulas/${aulaId}/files`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || t("materials.upload_error"));
        }

        const result = await response.json();
        const aula = result.data;

        const formattedMaterials = formatMaterialsFromAula(aula);
        setMaterials(formattedMaterials);

        // Limpar o input para permitir selecionar os mesmos arquivos novamente
        e.target.value = "";

        toast.success(
          files.length === 1
            ? t("materials.attach_success_single")
            : t("materials.attach_success_multiple", { count: files.length })
        );
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        toast.error(t("materials.attach_error"));
      }
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      const aulaId = getRequestAulaId();
      const response = await fetch(
        `/api/aulas/${aulaId}/files?fileId=${materialId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(t("materials.remove_file_error"));
      }

      const result = await response.json();

      // Se a resposta contém os dados atualizados, usar eles
      if (result.data) {
        const formattedMaterials = formatMaterialsFromAula(result.data);
        setMaterials(formattedMaterials);
      } else {
        // Caso contrário, recarregar da API
        const aulaResponse = await fetch(`/api/aulas/${aulaId}`);
        if (aulaResponse.ok) {
          const aulaData = await aulaResponse.json();
          const formattedMaterials = formatMaterialsFromAula(aulaData.data);
          setMaterials(formattedMaterials);
        } else {
          // Fallback: remover localmente
          setMaterials((prev) => prev.filter((m) => m.id !== materialId));
        }
      }

      toast.success(t("materials.remove_success"));
    } catch (error) {
      console.error("Erro ao remover arquivo:", error);
      toast.error(t("materials.remove_error"));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage("");
      const aulaId = getRequestAulaId();

      const alunosPayload = students
        .filter((student) => student.present)
        .map((student) => {
          return {
            aluno: student.id,
            comentario: student.comment || "",
            spinners_aula: student.spinners,
          };
        });

      const response = await fetch(`/api/aulas/${aulaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          anotacoes: notes,
          alunos: alunosPayload,
        }),
      });

      if (!response.ok) {
        throw new Error(t("save_error"));
      }

      setSaveMessage(t("save_success"));
      toast.success(t("save_success_toast"));
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error(t("save_error"));
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.length - presentCount;
  const attendancePercentage =
    students.length > 0 ? (presentCount / students.length) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f54a12] mx-auto"></div>
          <p className="text-gray-600 mt-4">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-11 px-4 mt-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("back")}
          </Button>
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{classItem.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>📅 {classItem.date}</span>
              <span>🕐 {classItem.time}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#f54a12] hover:bg-[#f54a12]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#f54a12]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? t("saving") : t("save_changes")}
          </Button>
          {saveMessage && (
            <span className="text-sm text-emerald-600 mt-2">{saveMessage}</span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{t("present")}</p>
            <p className="text-4xl text-gray-900">{presentCount}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{t("absent")}</p>
            <p className="text-4xl text-gray-900">{absentCount}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#599fe9]/10 rounded-xl">
                <Users className="w-6 h-6 text-[#599fe9]" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">
              {t("attendance_percentage")}
            </p>
            <p className="text-4xl text-gray-900">
              {attendancePercentage.toFixed(0)}%
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Attendance and Spinners */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl text-gray-900">{t("attendance_and_score")}</h2>
          <p className="text-gray-600 text-sm mt-1">
            {t("attendance_description")}
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700 w-12"></TableHead>
                <TableHead className="text-gray-700">{t("student")}</TableHead>
                <TableHead className="text-gray-700 text-center">
                  {t("attendance")}
                </TableHead>
                <TableHead className="text-gray-700 text-center">
                  {t("spinners")} (0-33)
                </TableHead>
                <TableHead className="text-gray-700 text-center w-24">
                  {t("comment")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Inbox className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">
                      {t("no_students")}
                    </h3>
                    <p className="text-gray-500">
                      {t("no_students_description")}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow
                    key={student.id}
                    className={`${
                      student.present ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <TableCell>
                      <Avatar className="w-8 h-8 bg-[#599fe9] text-white">
                        <AvatarFallback className="bg-[#599fe9] text-white text-xs">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={student.present}
                          onCheckedChange={() =>
                            handlePresenceToggle(student.id)
                          }
                          className="w-5 h-5"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="0"
                        max="33"
                        value={student.spinners}
                        onChange={(e) =>
                          handleSpinnersChange(
                            student.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        disabled={!student.present}
                        className="w-20 text-center bg-gray-50 border-gray-200 text-gray-900 h-9 mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <StudentCommentDialog
                          studentName={student.name}
                          comment={student.comment}
                          onSave={(comment) =>
                            handleCommentChange(student.id, comment)
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Materials */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-gray-900">{t("materials.title")}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {t("materials.description")}
              </p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#599fe9] text-white rounded-lg hover:bg-[#599fe9]/90 transition-colors h-11">
                <Upload className="w-5 h-5" />
                {t("materials.attach")}
              </span>
            </label>
          </div>
        </div>
        <div className="p-6">
          {materials.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">{t("materials.no_materials")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {renderFileIcon(material)}
                    <div>
                      <p className="text-gray-900">{material.name}</p>
                      <p className="text-sm text-gray-500">
                        {material.type} • {material.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (material.url) {
                          window.open(material.url, "_blank");
                        }
                      }}
                      className="text-[#599fe9] hover:text-[#599fe9] hover:bg-[#599fe9]/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Notes */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl text-gray-900">{t("notes.title")}</h2>
          <p className="text-gray-600 text-sm mt-1">{t("notes.description")}</p>
        </div>
        <div className="p-6">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("notes.placeholder")}
            className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg min-h-[150px] resize-none"
          />
        </div>
      </Card>
    </div>
  );
}
