import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import { Download, Award, Calendar, CheckCircle2, Share2 } from "lucide-react";

const mockCertificates = [
  {
    id: 1,
    courseName: "Marketing Digital",
    completionDate: "15/10/2024",
    mentor: "Prof. João Oliveira",
    spinners: 950,
    grade: "Excelente",
    certificateNumber: "NITRO-2024-MD-001",
  },
  {
    id: 2,
    courseName: "Desenvolvimento Web",
    completionDate: "20/09/2024",
    mentor: "Prof. Carlos Silva",
    spinners: 1200,
    grade: "Excelente",
    certificateNumber: "NITRO-2024-DW-002",
  },
  {
    id: 3,
    courseName: "Design Thinking",
    completionDate: "05/08/2024",
    mentor: "Prof. Ana Costa",
    spinners: 800,
    grade: "Muito Bom",
    certificateNumber: "NITRO-2024-DT-003",
  },
];

export function StudentCertificates() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDownload = (_certificate: (typeof mockCertificates)[0]) => {
    // Mock download functionality
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleShare = (_certificate: (typeof mockCertificates)[0]) => {
    // Mock share functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl text-gray-900 mb-2">Certificados</h1>
        <p className="text-gray-600">
          Seus certificados de conclusão e conquistas
        </p>
      </motion.div>

      {/* Certificates List */}
      <div className="space-y-4">
        {mockCertificates.map((certificate, index) => (
          <motion.div
            key={certificate.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="bg-white border-2 border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Certificate Icon/Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-32 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgMjAgMTAgTSAxMCAwIEwgMTAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZiZDM4ZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
                      <Award className="w-12 h-12 text-amber-500 relative z-10" />
                      <div className="absolute bottom-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl text-gray-900 mb-1">
                          {certificate.courseName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {certificate.mentor}
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-300">
                        {certificate.grade}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-gray-500">Conclusão</p>
                          <p className="text-sm">
                            {certificate.completionDate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-mono">
                      Nº {certificate.certificateNumber}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex lg:flex-col gap-2">
                    <Button
                      onClick={() => handleDownload(certificate)}
                      className="bg-gradient-to-r from-[#f54a12] to-[#ff6b35] hover:shadow-lg hover:shadow-[#f54a12]/30 text-white flex-1 lg:flex-none"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                    <Button
                      onClick={() => handleShare(certificate)}
                      variant="outline"
                      className="border-[#599fe9] text-[#599fe9] hover:bg-[#599fe9] hover:text-white flex-1 lg:flex-none"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State (if no certificates) */}
      {mockCertificates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Card className="bg-gray-50 border-2 border-dashed border-gray-300 p-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">
              Nenhum certificado ainda
            </h3>
            <p className="text-gray-500">
              Complete seus cursos para ganhar certificados!
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
