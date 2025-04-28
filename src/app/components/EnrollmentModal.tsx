"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { createStudent } from "@/lib/strapi";

interface EnrollmentModalProps {
  courseName: string;
  selectedTime: string | null;
  paymentLink?: string;
  cupons?: Array<{
    nome: string;
    url: string;
    valido: boolean;
    validade: string;
  }>;
  courseId: number;
}

export default function EnrollmentModal({
  courseName,
  selectedTime,
  paymentLink,
  cupons = [],
  courseId,
}: EnrollmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    nome: string;
    url: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const params = useParams();
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
  });

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
      ${appliedCoupon ? `Cupom aplicado: ${appliedCoupon.nome}` : ""}
      
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
        curso: courseId,
      });

      setIsOpen(false);
      if (appliedCoupon) {
        window.location.href = appliedCoupon.url;
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

  return (
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
      <DialogContent className="sm:max-w-[600px] bg-[#1e1b4b] text-white border-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6 text-orange-600">
            {modalT("title")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">{modalT("student.name")}</Label>
            <Input
              id="studentName"
              required
              value={formData.studentName}
              onChange={(e) =>
                setFormData({ ...formData, studentName: e.target.value })
              }
              className="bg-[#2a2a4a] border-none text-white"
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
                setFormData({ ...formData, studentBirthDate: e.target.value })
              }
              className="bg-[#2a2a4a] border-none text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianName">{modalT("guardian.name")}</Label>
            <Input
              id="guardianName"
              required
              value={formData.guardianName}
              onChange={(e) =>
                setFormData({ ...formData, guardianName: e.target.value })
              }
              className="bg-[#2a2a4a] border-none text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianEmail">{modalT("guardian.email")}</Label>
            <Input
              id="guardianEmail"
              type="email"
              required
              value={formData.guardianEmail}
              onChange={(e) =>
                setFormData({ ...formData, guardianEmail: e.target.value })
              }
              className="bg-[#2a2a4a] border-none text-white"
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
              className="bg-[#2a2a4a] border-none text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianPhone">{modalT("guardian.phone")}</Label>
            <Input
              id="guardianPhone"
              type="tel"
              required
              value={formData.guardianPhone}
              onChange={(e) =>
                setFormData({ ...formData, guardianPhone: e.target.value })
              }
              className="bg-[#2a2a4a] border-none text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">{modalT("location.country")}</Label>
            <Input
              id="country"
              required
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="bg-[#2a2a4a] border-none text-white"
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
              className="bg-[#2a2a4a] border-none text-white"
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
              className="bg-[#2a2a4a] border-none text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentPhone">{modalT("student.phone")}</Label>
            <Input
              id="studentPhone"
              type="tel"
              value={formData.studentPhone}
              onChange={(e) =>
                setFormData({ ...formData, studentPhone: e.target.value })
              }
              className="bg-[#2a2a4a] border-none text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="couponCode">{modalT("coupon.label")}</Label>
            <div className="flex gap-2">
              <Input
                id="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-[#2a2a4a] border-none text-white"
                placeholder={modalT("coupon.placeholder")}
              />
              <Button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-orange-600 text-[#1e1b4b] hover:bg-orange-500"
              >
                {modalT("coupon.apply")}
              </Button>
            </div>
            {couponError && (
              <p className="text-red-500 text-sm">{couponError}</p>
            )}
            {appliedCoupon && (
              <div className="flex items-center gap-2 bg-green-500/20 p-2 rounded">
                <span>{appliedCoupon.nome}</span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-white hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            id="enrollment-button-modal"
            className="w-full bg-orange-600 text-[#1e1b4b] hover:bg-orange-500"
            disabled={isLoading}
          >
            {isLoading ? modalT("loading") : modalT("enroll")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
