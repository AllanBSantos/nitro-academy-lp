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
import { createStudent, fetchSchools } from "@/lib/strapi";
// import { X } from "lucide-react";

interface EnrollmentModalProps {
  courseName: string;
  selectedTime: string | null;
  // paymentLink?: string;
  // link_desconto: string | null;
  // cupons?: Array<{
  //   id: number;
  //   documentId: string;
  //   nome: string;
  //   url: string | null;
  //   valido: boolean;
  //   validade: string | null;
  //   voucher_gratuito: boolean;
  // }>;
  courseId: number;
  scheduleIndex: number;
  disabled?: boolean;
  aviso_matricula?: string;
  pre_requisitos?: string;
}

interface School {
  id: string;
  nome: string;
}

interface Turma {
  nome: string;
}

interface Aluno {
  nome: string;
  escola: string;
  turma: string;
}

export default function EnrollmentModal({
  courseName,
  selectedTime,
  // paymentLink,
  // link_desconto,
  // cupons = [],
  courseId,
  scheduleIndex,
  disabled = false,
  aviso_matricula,
}: EnrollmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMaterialComplementarModalOpen, setIsMaterialComplementarModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [couponCode, setCouponCode] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoadingTurmas, setIsLoadingTurmas] = useState(false);
  const [isLoadingAlunos, setIsLoadingAlunos] = useState(false);
  const [showAlunosDropdown, setShowAlunosDropdown] = useState(false);
  // const [appliedCoupon, setAppliedCoupon] = useState<{
  //   id: number;
  //   documentId: string;
  //   nome: string;
  //   url: string | null;
  //   valido: boolean;
  //   validade: string | null;
  //   voucher_gratuito: boolean;
  // } | null>(null);
  // const [couponError, setCouponError] = useState("");
  const [isPartnerStudent, setIsPartnerStudent] = useState(false);
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "pt";
  const t = useTranslations("TimeSelection");
  const modalT = useTranslations("EnrollmentModal");

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
    portadorDeficiencia: false,
    descricaoDeficiencia: "",
  });

  useEffect(() => {
    const loadSchools = async () => {
      const fetchedSchools = await fetchSchools();
      setSchools(fetchedSchools);
    };
    loadSchools();
  }, []);

  // Função para carregar turmas quando uma escola é selecionada
  const loadTurmas = async (escola: string) => {
    if (!escola) {
      setTurmas([]);
      setAlunos([]);
      setFormData((prev) => ({ ...prev, classNumber: "", studentName: "" }));
      setIsPartnerStudent(false);
      return;
    }

    setIsLoadingTurmas(true);
    try {
      const response = await fetch(
        `/api/turmas?escola=${encodeURIComponent(escola)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTurmas(data.data.map((turma: string) => ({ nome: turma })));
        } else {
          setTurmas([]);
        }
      } else {
        console.error("Erro na resposta da API turmas:", response.status);
        setTurmas([]);
      }
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      setTurmas([]);
    } finally {
      setIsLoadingTurmas(false);
    }

    // Limpar dados dependentes
    setAlunos([]);
    setFormData((prev) => ({ ...prev, classNumber: "", studentName: "" }));
    setIsPartnerStudent(false);
  };

  // Função para carregar alunos quando uma turma é selecionada
  const loadAlunos = async (escola: string, turma: string, search?: string) => {
    if (!escola || !turma) {
      setAlunos([]);
      setFormData((prev) => ({ ...prev, studentName: "" }));
      setIsPartnerStudent(false);
      setShowAlunosDropdown(false);
      return;
    }

    // Só buscar se não há busca ou se a busca tem pelo menos 2 caracteres
    if (search && search.length < 2) {
      setAlunos([]);
      setShowAlunosDropdown(false);
      return;
    }

    setIsLoadingAlunos(true);
    try {
      let url = `/api/alunos-turma?escola=${encodeURIComponent(
        escola
      )}&turma=${encodeURIComponent(turma)}`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAlunos(data.data);
          setShowAlunosDropdown(data.data.length > 0);
        } else {
          setAlunos([]);
          setShowAlunosDropdown(false);
        }
      } else {
        setAlunos([]);
        setShowAlunosDropdown(false);
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      setAlunos([]);
      setShowAlunosDropdown(false);
    } finally {
      setIsLoadingAlunos(false);
    }

    // Limpar dados dependentes se não há busca
    if (!search) {
      setFormData((prev) => ({ ...prev, studentName: "" }));
      setIsPartnerStudent(false);
    }
  };

  // const handleApplyCoupon = async () => {
  //   setCouponError("");
  //   const coupon = cupons.find(
  //     (c) => c.nome.toLowerCase() === couponCode.toLowerCase()
  //   );

  //   if (!coupon) {
  //     setCouponError(modalT("errors.invalid_coupon"));
  //     return;
  //   }

  //   const today = new Date();
  //   let validade: Date | null = null;

  //   if (coupon.validade) {
  //     const [year, month, day] = coupon.validade.split("-").map(Number);
  //     validade = new Date(year, month - 1, day, 23, 59, 59, 999);
  //   }

  //   if (!coupon.valido || (validade && today.getTime() > validade.getTime())) {
  //     setCouponError(modalT("errors.expired_coupon"));
  //     return;
  //   }

  //   if (couponCode.toLowerCase() === "voucher100") {
  //     try {
  //       const existingStudent = await findStudentByCPF(formData.studentCPF);
  //       if (existingStudent?.usou_voucher) {
  //         setCouponError(modalT("coupon.voucher_used"));
  //         return;
  //       }
  //     } catch (error) {
  //       console.error("Error checking voucher usage:", error);
  //     }
  //   }

  //   if (!coupon.url && !link_desconto && !coupon.voucher_gratuito) {
  //     setCouponError(modalT("errors.invalid_coupon"));
  //     return;
  //   }

  //   setAppliedCoupon(coupon);
  //   setCouponCode("");
  // };

  // const handleRemoveCoupon = () => {
  //   setAppliedCoupon(null);
  //   setCouponError("");
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (aviso_matricula) {
      setIsMaterialComplementarModalOpen(true);
      return;
    }

    await processEnrollment();
  };

  const sendEnrollmentEmails = async () => {
    const disabilityInfo = formData.portadorDeficiencia
      ? `Portador de deficiência: Sim\nDescrição: ${formData.descricaoDeficiencia}`
      : "Portador de deficiência: Não";

    const emailBody = `
      Nova matrícula para o curso: ${courseName}
      Horário selecionado: ${selectedTime}
      Turma: ${formData.classNumber}
      Dados do Aluno:
      Nome: ${formData.studentName}
      Data de Nascimento: ${formData.studentBirthDate}
      CPF: ${formData.studentCPF}
      Celular: ${formData.studentPhone}
      ${disabilityInfo}
      
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

      const schoolName = isPartnerStudent ? formData.partnerSchool : undefined;

      // Verificar se o cupom é gratuito
      // const isVoucherGratuito =
      //   appliedCoupon?.voucher_gratuito || isPartnerStudent;
      const isVoucherGratuito = isPartnerStudent;

      await createStudent({
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
        portador_deficiencia: formData.portadorDeficiencia,
        descricao_deficiencia: formData.descricaoDeficiencia,
        cursos: [{ id: courseId, documentId: courseId.toString() }],
        escola_parceira: schoolName,
        turma: scheduleIndex + 1,
        usou_voucher: isVoucherGratuito, // Set as true if partner student or voucher gratuito
        publishedAt: new Date().toISOString(),
      });

      setIsOpen(false);

      // Se há cupom aplicado com voucher_gratuito, mostrar modal de sucesso
      // if (appliedCoupon && appliedCoupon.voucher_gratuito) {
      //   setIsSuccessModalOpen(true);
      //   return;
      // }

      // Se há cupom aplicado, usar URL do cupom ou link_desconto como fallback
      // if (appliedCoupon) {
      //   const redirectUrl = appliedCoupon.url || link_desconto;
      //   if (redirectUrl) {
      //     window.location.href = redirectUrl;
      //     return;
      //   }
      // }

      if (isPartnerStudent) {
        setIsSuccessModalOpen(true);
        return;
      }
      // else if (paymentLink) {
      //   window.location.href = paymentLink;
      // }
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
            {/* School, Class and Student Selection */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerSchool">
                    {modalT("partner_school.label")}
                  </Label>
                  <select
                    id="partnerSchool"
                    required
                    value={formData.partnerSchool}
                    onChange={(e) => {
                      const selectedSchool = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        partnerSchool: selectedSchool,
                      }));
                      loadTurmas(selectedSchool);
                    }}
                    className="w-full bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6] rounded-md p-2"
                  >
                    <option value="">
                      {modalT("partner_school.placeholder")}
                    </option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.nome}>
                        {school.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classNumber">
                    {modalT("class_number.label")}
                  </Label>
                  <select
                    id="classNumber"
                    required
                    value={formData.classNumber}
                    onChange={(e) => {
                      const selectedTurma = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        classNumber: selectedTurma,
                      }));
                      // Limpar alunos quando trocar de turma
                      setAlunos([]);
                      setShowAlunosDropdown(false);
                      setFormData((prev) => ({ ...prev, studentName: "" }));
                      setIsPartnerStudent(false);
                    }}
                    disabled={!formData.partnerSchool || isLoadingTurmas}
                    className="w-full bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6] rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {isLoadingTurmas
                        ? "Carregando turmas..."
                        : "Selecione uma turma"}
                    </option>
                    {turmas.map((turma, index) => (
                      <option key={index} value={turma.nome}>
                        {turma.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName">{modalT("student.name")}</Label>
                <div className="relative">
                  <Input
                    id="studentName"
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        studentName: value,
                      }));

                      // Buscar alunos quando digitar 2 ou mais caracteres
                      if (
                        value.length >= 2 &&
                        formData.partnerSchool &&
                        formData.classNumber
                      ) {
                        loadAlunos(
                          formData.partnerSchool,
                          formData.classNumber,
                          value
                        );
                      } else if (value.length < 2) {
                        setAlunos([]);
                        setShowAlunosDropdown(false);
                      }

                      // Resetar status de aluno parceiro
                      setIsPartnerStudent(false);
                    }}
                    onFocus={() => {
                      if (
                        formData.studentName.length >= 2 &&
                        formData.partnerSchool &&
                        formData.classNumber
                      ) {
                        setShowAlunosDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay para permitir clicar no dropdown
                      setTimeout(() => setShowAlunosDropdown(false), 200);
                    }}
                    placeholder=""
                    disabled={!formData.classNumber}
                    className="w-full bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  {/* Dropdown de alunos */}
                  {showAlunosDropdown && alunos.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {alunos.map((aluno, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              studentName: aluno.nome,
                            }));
                            setIsPartnerStudent(true);
                            setShowAlunosDropdown(false);
                            setAlunos([]);
                          }}
                        >
                          {aluno.nome}
                        </div>
                      ))}
                    </div>
                  )}

                  {isLoadingAlunos && (
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="space-y-4">
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

            {/* Disability Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="portadorDeficiencia"
                    checked={formData.portadorDeficiencia}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portadorDeficiencia: e.target.checked,
                        descricaoDeficiencia: e.target.checked
                          ? formData.descricaoDeficiencia
                          : "",
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label
                    htmlFor="portadorDeficiencia"
                    className="text-sm font-medium text-gray-700"
                  >
                    {modalT("student.disability")}
                  </Label>
                </div>
              </div>

              {formData.portadorDeficiencia && (
                <div className="space-y-2">
                  <Label htmlFor="descricaoDeficiencia">
                    {modalT("student.disability_description")}
                  </Label>
                  <Input
                    id="descricaoDeficiencia"
                    required={formData.portadorDeficiencia}
                    value={formData.descricaoDeficiencia}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descricaoDeficiencia: e.target.value,
                      })
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </div>
              )}
            </div>

            {/* Coupon Section - COMMENTED OUT FOR FUTURE USE */}
            {/* <div className="space-y-4">
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
                    className="bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!couponCode}
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
            </div> */}

            <Button
              type="submit"
              id="enrollment-button-modal"
              className="w-full bg-orange-600 text-white hover:bg-orange-500 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isPartnerStudent}
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
            <p className="text-lg text-gray-700">{aviso_matricula}</p>
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
