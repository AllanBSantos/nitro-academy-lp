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
import { createStudent, fetchSchools, findStudentByCPF } from "@/lib/strapi";

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
  disabled?: boolean;
  material_complementar?: boolean;
  pre_requisitos?: string;
}

interface School {
  id: string;
  nome: string;
}

export default function EnrollmentModal({
  courseName,
  selectedTime,
  paymentLink,
  /*   link_desconto, */
  /*   cupons = [], */
  courseId,
  scheduleIndex,
  disabled = false,
  material_complementar,
  pre_requisitos,
}: EnrollmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMaterialComplementarModalOpen, setIsMaterialComplementarModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  /*   const [couponCode, setCouponCode] = useState(""); */
  const [schools, setSchools] = useState<School[]>([]);
  /*   const [appliedCoupon, setAppliedCoupon] = useState<{
    id: number;
    documentId: string;
    nome: string;
    url: string | null;
    valido: boolean;
    validade: string | null;
    voucher_gratuito: boolean;
  } | null>(null);
  const [couponError, setCouponError] = useState(""); */
  const [isPartnerStudent, setIsPartnerStudent] = useState(false);
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("TimeSelection");
  const modalT = useTranslations("EnrollmentModal");

  const extractContactFromPrerequisites = (
    text: string
  ): { type: "link" | "phone"; value: string } | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatch = text.match(urlRegex);
    const phoneRegex = /(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})/g;
    const phoneMatch = text.match(phoneRegex);

    if (urlMatch && urlMatch[0]) {
      return { type: "link", value: urlMatch[0] };
    }

    if (phoneMatch && phoneMatch[0]) {
      return { type: "phone", value: phoneMatch[0] };
    }

    return null;
  };

  const contactInfo = pre_requisitos
    ? extractContactFromPrerequisites(pre_requisitos)
    : null;

  const [formData, setFormData] = useState({
    studentName: "",
    studentBirthDate: "",
    studentCPF: "",
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

  /* const handleApplyCoupon = async () => {
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

    if (couponCode.toLowerCase() === "voucher100") {
      try {
        const existingStudent = await findStudentByCPF(formData.studentCPF);
        if (existingStudent?.usou_voucher) {
          setCouponError(modalT("coupon.voucher_used"));
          return;
        }
      } catch (error) {
        console.error("Error checking voucher usage:", error);
      }
    }

    if (!coupon.url && !link_desconto && !coupon.voucher_gratuito) {
      setCouponError(modalT("errors.invalid_coupon"));
      return;
    }

    setAppliedCoupon(coupon);
    setCouponCode("");
  }; */

  /*   const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  }; */

  const searchPartnerStudent = async (studentName: string) => {
    if (!studentName.trim()) {
      setIsPartnerStudent(false);
      setFormData((prev) => ({
        ...prev,
        partnerSchool: "",
        classNumber: "",
      }));
      return;
    }

    setIsSearchingStudent(true);
    try {
      const response = await fetch(
        `/api/partner-students/search?name=${encodeURIComponent(studentName)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.count > 0) {
          const student = data.data[0];

          // Check if student already used voucher by searching in existing students
          try {
            const existingStudent = await findStudentByCPF(formData.studentCPF);

            if (existingStudent?.usou_voucher) {
              // Student already used voucher, don't treat as partner student
              setIsPartnerStudent(false);
              setFormData((prev) => ({
                ...prev,
                partnerSchool: "",
                classNumber: "",
              }));
            } else {
              // Student found and hasn't used voucher yet
              setIsPartnerStudent(true);
              setFormData((prev) => ({
                ...prev,
                partnerSchool: student.escola || "",
                classNumber: student.turma || "",
              }));
            }
          } catch (error) {
            console.error("Error checking voucher usage:", error);
            // If error checking, treat as partner student (safer approach)
            setIsPartnerStudent(true);
            setFormData((prev) => ({
              ...prev,
              partnerSchool: student.escola || "",
              classNumber: student.turma || "",
            }));
          }
        } else {
          setIsPartnerStudent(false);
          setFormData((prev) => ({
            ...prev,
            partnerSchool: "",
            classNumber: "",
          }));
        }
      }
    } catch (error) {
      console.error("Error searching partner student:", error);
      setIsPartnerStudent(false);
      setFormData((prev) => ({
        ...prev,
        partnerSchool: "",
        classNumber: "",
      }));
    } finally {
      setIsSearchingStudent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (material_complementar && contactInfo) {
      setIsMaterialComplementarModalOpen(true);
      return;
    }

    await processEnrollment();
  };

  const sendEnrollmentEmails = async () => {
    const emailBody = `
      Nova matrícula para o curso: ${courseName}
      Horário selecionado: ${selectedTime}
      Turma: ${formData.classNumber}
      Dados do Aluno:
      Nome: ${formData.studentName}
      Data de Nascimento: ${formData.studentBirthDate}
      CPF: ${formData.studentCPF}
      Celular: ${formData.studentPhone}
      
      Dados do Responsável:
      Nome: ${formData.guardianName}
      E-mail: ${formData.guardianEmail}
      CPF: ${formData.guardianCPF}
      Celular: ${formData.guardianPhone}
      País: ${formData.country}
      Estado: ${formData.state}
      Cidade: ${formData.city}
    `;

    const welcomeEmailBody = `
      Olá ${formData.studentName}, tudo bem?

      Parabéns por garantir sua vaga no curso ${courseName}!
      Estamos muito felizes em ter você conosco nesta experiência transformadora.

      ✨ Boas-vindas ao curso "${courseName}"
      Prepare-se para vivências práticas, envolventes e cheias de propósito — pensadas especialmente para ajudar adolescentes a se comunicarem com mais segurança, lidarem com suas emoções, descobrirem seu talento único e desenvolverem habilidades essenciais para a vida.

      📲 Como vai funcionar:

      Em breve entraremos em contato com os horários e links das aulas da sua turma. Fique atento às nossas mensagens!

      Se tiver qualquer dúvida, estamos por aqui para ajudar.

      Seja muito bem-vindo(a) à Nitro Academy — estamos animados para começar essa jornada com você! 🚀

      Com carinho,
      Equipe Nitro

      📲 Instagram: @nitroacademybr
      ➡️Site: Nitro.academy
    `;

    try {
      const emailRecipients =
        process.env.NEXT_PUBLIC_ENROLLMENT_EMAIL?.split(",").map((email) =>
          email.trim()
        ) || [];

      const emailPromises = emailRecipients.map((recipient) =>
        fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: recipient,
            subject: `Nova matrícula - ${courseName}`,
            text: emailBody,
          }),
        })
      );

      const emailResponses = await Promise.all(emailPromises);

      const failedEmails = emailResponses.filter((response) => !response.ok);
      if (failedEmails.length > 0) {
        console.error("Failed to send notification emails to some recipients");
        throw new Error("Failed to send notification emails");
      }

      const welcomeEmailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.guardianEmail,
          subject:
            "🎉 Seja bem-vindo(a)! Sua jornada com a Nitro começa agora!",
          text: welcomeEmailBody,
        }),
      });

      if (!welcomeEmailResponse.ok) {
        console.error(
          "Failed to send welcome email, but enrollment was successful"
        );
      }
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  const processEnrollment = async () => {
    setIsLoading(true);

    try {
      await sendEnrollmentEmails();

      /*   const schoolName = appliedCoupon?.voucher_gratuito
        ? schools.find((s) => s.id === formData.partnerSchool)?.nome
        : isPartnerStudent
        ? formData.partnerSchool // Use the escola name directly
        : undefined; */

      const schoolName = isPartnerStudent ? formData.partnerSchool : undefined;

      await createStudent(
        {
          nome: formData.studentName,
          data_nascimento: formData.studentBirthDate,
          cpf_aluno: formData.studentCPF,
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
          usou_voucher: isPartnerStudent, // Set as true if partner student
          publishedAt: new Date().toISOString(),
        }
        /* appliedCoupon?.nome */
      );

      setIsOpen(false);
      /*      if (appliedCoupon) {
        if (appliedCoupon.voucher_gratuito) {
          setIsSuccessModalOpen(true);
          return;
        }
        const redirectUrl = appliedCoupon.url || link_desconto;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      } else */
      if (isPartnerStudent) {
        setIsSuccessModalOpen(true);
        return;
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

  const handleMaterialComplementarAcknowledge = () => {
    setIsMaterialComplementarModalOpen(false);
    processEnrollment();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            id="enrollment-button"
            className="bg-orange-600 text-[#1e1b4b] text-xl font-bold py-4 px-8 rounded-[24px] hover:bg-orange-500 transition-colors duration-300 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled || !selectedTime}
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
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="space-y-6 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">{modalT("student.name")}</Label>
                  <div className="relative">
                    <Input
                      id="studentName"
                      required
                      value={formData.studentName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          studentName: e.target.value,
                        })
                      }
                      onBlur={(e) => searchPartnerStudent(e.target.value)}
                      className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                    />
                    {isSearchingStudent && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                  {isPartnerStudent && (
                    <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      {modalT("student_found")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentBirthDate">
                    {modalT("student.birthDate")}
                  </Label>
                  <Input
                    id="studentBirthDate"
                    type="text"
                    required
                    placeholder="DD/MM/AAAA"
                    value={
                      formData.studentBirthDate
                        ? formData.studentBirthDate
                            .split("-")
                            .reverse()
                            .join("/")
                        : ""
                    }
                    onChange={(e) => {
                      let value = e.target.value;

                      value = value.replace(/\D/g, "");

                      if (value.length > 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2);
                      }
                      if (value.length > 5) {
                        value = value.slice(0, 5) + "/" + value.slice(5);
                      }

                      value = value.slice(0, 10);

                      setFormData({
                        ...formData,
                        studentBirthDate: value,
                      });
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      const parts = value.split("/");

                      if (parts.length === 3) {
                        const [day, month, year] = parts.map(Number);

                        if (day && month && year) {
                          const date = new Date(year, month - 1, day);
                          const isValidDate =
                            date.getDate() === day &&
                            date.getMonth() === month - 1 &&
                            date.getFullYear() === year &&
                            year >= 1900 &&
                            year <= new Date().getFullYear();

                          if (isValidDate) {
                            const isoDate = `${year}-${String(month).padStart(
                              2,
                              "0"
                            )}-${String(day).padStart(2, "0")}`;
                            setFormData({
                              ...formData,
                              studentBirthDate: isoDate,
                            });
                          } else {
                            e.target.value = "";
                            setFormData({
                              ...formData,
                              studentBirthDate: "",
                            });
                          }
                        }
                      }
                    }}
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentCPF">{modalT("student.cpf")}</Label>
                  <Input
                    id="studentCPF"
                    required
                    value={formData.studentCPF}
                    onChange={(e) =>
                      setFormData({ ...formData, studentCPF: e.target.value })
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
                    required
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
              {/*  <div className="space-y-2">
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
                    className="bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.studentCPF}
                  >
                    {modalT("coupon.apply")}
                  </Button>
                </div>
                {!formData.studentCPF && (
                  <p className="text-sm text-gray-500">
                    {modalT("coupon.cpf_required")}
                  </p>
                )}
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
              </div> */}

              {/* {(appliedCoupon?.voucher_gratuito || isPartnerStudent) && ( */}
              {isPartnerStudent && (
                <div className="space-y-2">
                  <Label htmlFor="partnerSchool">
                    {modalT("partner_school.label")}
                  </Label>
                  {isPartnerStudent ? (
                    <input
                      type="text"
                      id="partnerSchool"
                      value={formData.partnerSchool}
                      readOnly
                      className="w-full bg-gray-100 border-gray-200 rounded-md p-2 text-gray-600 cursor-not-allowed"
                    />
                  ) : (
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
                  )}
                </div>
              )}

              {isPartnerStudent && (
                <div className="space-y-2">
                  <Label htmlFor="classNumber">
                    {modalT("class_number.label")}
                  </Label>
                  <Input
                    id="classNumber"
                    value={formData.classNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        classNumber: e.target.value,
                      })
                    }
                    disabled={isPartnerStudent}
                    className={`bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6] ${
                      isPartnerStudent ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    placeholder={modalT("class_number.placeholder")}
                  />
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

      <Dialog
        open={isMaterialComplementarModalOpen}
        onOpenChange={setIsMaterialComplementarModalOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-white text-[#1e1b4b] border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6 text-[#1e1b4b]">
              {modalT("material_complementar.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700">
              {contactInfo?.type === "link"
                ? modalT("material_complementar.message_link")
                : modalT("material_complementar.message_phone")}{" "}
              {contactInfo && contactInfo.type === "link" && (
                <a
                  href={contactInfo.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3B82F6] hover:underline font-medium"
                >
                  {contactInfo.value}
                </a>
              )}
              {contactInfo && contactInfo.type === "phone" && (
                <span className="text-[#3B82F6] font-medium">
                  {contactInfo.value}
                </span>
              )}
            </p>
            <Button
              onClick={handleMaterialComplementarAcknowledge}
              className="bg-orange-600 text-white hover:bg-orange-500 py-6 text-lg font-semibold w-full"
            >
              {modalT("material_complementar.acknowledge")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
