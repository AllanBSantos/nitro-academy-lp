"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { createStudent, fetchSchools } from "@/lib/strapi";

interface EnrollmentModalProps {
  courseName: string;
  selectedTime: string | null;
  paymentLink?: string;
  link_desconto: string | null;
  cupons?: Array<{
    id: number;
    documentId: string;
    nome: string;
    url: string | null;
    valido: boolean;
    validade: string | null;
    voucher_gratuito: boolean;
  }>;
  courseId: number;
  scheduleIndex: number;
}

interface School {
  id: string;
  nome: string;
}

export default function EnrollmentModal({
  courseName,
  selectedTime,
  paymentLink,
  link_desconto,
  cupons = [],
  courseId,
  scheduleIndex,
}: EnrollmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: number;
    documentId: string;
    nome: string;
    url: string | null;
    valido: boolean;
    validade: string | null;
    voucher_gratuito: boolean;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("TimeSelection");
  const modalT = useTranslations("EnrollmentModal");

  const [formData, setFormData] = useState({
    studentName: "",
    studentBirthDate: "",
    guardianName: "",
    guardianEmail: "",
    guardianCPF: "",
    guardianPhone: "",
    country: locale === "pt" ? "Brasil" : "",
    state: "",
    city: "",
    studentPhone: "",
    partnerSchool: "",
    classNumber: "",
  });

  useEffect(() => {
    const loadSchools = async () => {
      const fetchedSchools = await fetchSchools();
      setSchools(fetchedSchools);
    };
    loadSchools();
  }, []);

  const handleApplyCoupon = () => {
    setCouponError("");
    const coupon = cupons.find(
      (c) => c.nome.toLowerCase() === couponCode.toLowerCase()
    );

    if (!coupon) {
      setCouponError(modalT("errors.invalid_coupon"));
      return;
    }

    const today = new Date();
    let validade: Date | null = null;

    if (coupon.validade) {
      const [year, month, day] = coupon.validade.split("-").map(Number);
      validade = new Date(year, month - 1, day, 23, 59, 59, 999);
    }

    if (!coupon.valido || (validade && today.getTime() > validade.getTime())) {
      setCouponError(modalT("errors.expired_coupon"));
      return;
    }

    if (!coupon.url && !link_desconto && !coupon.voucher_gratuito) {
      setCouponError(modalT("errors.invalid_coupon"));
      return;
    }

    setAppliedCoupon(coupon);
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const emailBody = `
      Nova matrícula para o curso: ${courseName}
      Horário selecionado: ${selectedTime}
      Turma: ${formData.classNumber}
      ${appliedCoupon ? `Cupom aplicado: ${appliedCoupon.nome}` : ""}
      ${
        appliedCoupon?.voucher_gratuito
          ? `Escola parceira: ${
              schools.find((s) => s.id === formData.partnerSchool)?.nome ||
              "Não informada"
            }`
          : ""
      }
      
      Dados do Aluno:
      Nome: ${formData.studentName}
      Data de Nascimento: ${formData.studentBirthDate}
      Celular: ${formData.studentPhone || "Não informado"}
      
      Dados do Responsável:
      Nome: ${formData.guardianName}
      E-mail: ${formData.guardianEmail}
      CPF: ${formData.guardianCPF}
      Celular: ${formData.guardianPhone}
      País: ${formData.country}
      Estado: ${formData.state}
      Cidade: ${formData.city}
    `;

    try {
      // Enviar email
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: process.env.NEXT_PUBLIC_ENROLLMENT_EMAIL,
          subject: `Nova matrícula - ${courseName}`,
          text: emailBody,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to send email");
      }

      const schoolName = appliedCoupon?.voucher_gratuito
        ? schools.find((s) => s.id === formData.partnerSchool)?.nome
        : undefined;

      // Criar aluno no Strapi
      await createStudent({
        nome: formData.studentName,
        data_nascimento: formData.studentBirthDate,
        responsavel: formData.guardianName,
        email_responsavel: formData.guardianEmail,
        cpf_responsavel: formData.guardianCPF,
        telefone_responsavel: formData.guardianPhone,
        pais: formData.country,
        estado: formData.state,
        cidade: formData.city,
        telefone_aluno: formData.studentPhone,
        cursos: [{ id: courseId, documentId: courseId.toString() }],
        escola_parceira: schoolName,
        turma: scheduleIndex + 1,
        publishedAt: new Date().toISOString(),
      });

      setIsOpen(false);
      if (appliedCoupon) {
        if (appliedCoupon.voucher_gratuito) {
          setIsSuccessModalOpen(true);
          return;
        }
        const redirectUrl = appliedCoupon.url || link_desconto;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      } else if (paymentLink) {
        window.location.href = paymentLink;
      }
    } catch (error) {
      console.error("Error in enrollment process:", error);
      alert(modalT("errors.submit"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    router.push(`/${locale}`);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            id="enrollment-button"
            className="bg-orange-600 text-[#1e1b4b] text-xl font-bold py-4 px-8 rounded-[24px] hover:bg-orange-500 transition-colors duration-300 w-full max-w-md"
            disabled={!selectedTime}
          >
            {t("enroll")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-white text-[#1e1b4b] border-none max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6 text-[#1e1b4b]">
              {modalT("title")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">{modalT("student.name")}</Label>
                  <Input
                    id="studentName"
                    required
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData({ ...formData, studentName: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentBirthDate">
                    {modalT("student.birthDate")}
                  </Label>
                  <Input
                    id="studentBirthDate"
                    type="date"
                    required
                    value={formData.studentBirthDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        studentBirthDate: e.target.value,
                      })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentPhone">
                    {modalT("student.phone")}
                  </Label>
                  <Input
                    id="studentPhone"
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, studentPhone: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">
                    {modalT("guardian.name")}
                  </Label>
                  <Input
                    id="guardianName"
                    required
                    value={formData.guardianName}
                    onChange={(e) =>
                      setFormData({ ...formData, guardianName: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianEmail">
                    {modalT("guardian.email")}
                  </Label>
                  <Input
                    id="guardianEmail"
                    type="email"
                    required
                    value={formData.guardianEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guardianEmail: e.target.value,
                      })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianCPF">{modalT("guardian.cpf")}</Label>
                  <Input
                    id="guardianCPF"
                    required
                    value={formData.guardianCPF}
                    onChange={(e) =>
                      setFormData({ ...formData, guardianCPF: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">
                    {modalT("guardian.phone")}
                  </Label>
                  <Input
                    id="guardianPhone"
                    type="tel"
                    required
                    value={formData.guardianPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guardianPhone: e.target.value,
                      })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">{modalT("location.country")}</Label>
                  <Input
                    id="country"
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">{modalT("location.state")}</Label>
                  <Input
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{modalT("location.city")}</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="couponCode">{modalT("coupon.label")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="couponCode"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                    placeholder={modalT("coupon.placeholder")}
                  />
                  <Button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-orange-600 text-white hover:bg-orange-500"
                  >
                    {modalT("coupon.apply")}
                  </Button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg border border-green-200">
                    <span className="text-green-700">{appliedCoupon.nome}</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-green-700 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Partner School Selector - Only shown when free voucher is applied */}
              {appliedCoupon?.voucher_gratuito && (
                <div className="space-y-2">
                  <Label htmlFor="partnerSchool">
                    {modalT("partner_school.label")}
                  </Label>
                  <select
                    id="partnerSchool"
                    required
                    value={formData.partnerSchool}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partnerSchool: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6] rounded-md p-2"
                  >
                    <option value="">
                      {modalT("partner_school.placeholder")}
                    </option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <Button
              type="submit"
              id="enrollment-button-modal"
              className="w-full bg-orange-600 text-white hover:bg-orange-500 py-6 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? modalT("loading") : modalT("enroll")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-[#1e1b4b] border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6 text-[#1e1b4b]">
              {modalT("success.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700">
              {modalT("success.message", { courseName })}
            </p>
            <Button
              onClick={handleSuccessModalClose}
              className="bg-orange-600 text-white hover:bg-orange-500 py-6 text-lg font-semibold w-full"
            >
              {modalT("success.ok")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
