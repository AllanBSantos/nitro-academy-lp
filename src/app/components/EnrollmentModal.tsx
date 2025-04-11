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

interface EnrollmentModalProps {
  courseName: string;
  selectedTime: string | null;
  paymentLink?: string;
}

export default function EnrollmentModal({
  courseName,
  selectedTime,
  paymentLink,
}: EnrollmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const emailBody = `
      Nova matrícula para o curso: ${courseName}
      Horário selecionado: ${selectedTime}
      
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
      const response = await fetch("/api/send-email", {
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

      if (response.ok) {
        setIsOpen(false);
        if (paymentLink) {
          window.location.href = paymentLink;
        }
      } else {
        alert("Erro ao enviar matrícula. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Erro ao enviar matrícula. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
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

          <Button
            type="submit"
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
