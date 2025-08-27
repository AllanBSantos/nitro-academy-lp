"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Search, User, BookOpen } from "lucide-react";
import Cookies from "js-cookie";

interface Role {
  id: number;
  name: string;
  type: string;
  description: string;
}

interface RolesResponse {
  roles: Role[];
}

export default function IdentifyPage() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<RolesResponse | null>(null);
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("Identify");

  const locale = params.locale as string;

  // Fetch available roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/users/list-roles");
        if (response.ok) {
          const rolesData = await response.json();
          setRoles(rolesData);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    // Check if user is already linked before showing identification screen
    const checkUserStatus = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          router.replace(`/${locale}/login`);
          return;
        }

        // Verify user role to check if already linked
        const response = await fetch("/api/auth/verify-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const userData = await response.json();

          // If user is already linked, redirect directly
          if (userData.studentId || userData.mentorId) {
            if (userData.role.type === "student") {
              const studentUrl =
                locale === "pt" ? "/pt/student" : "/en/student";
              router.replace(studentUrl);
              return;
            } else if (userData.role.type === "mentor") {
              const adminUrl = locale === "pt" ? "/pt/admin" : "/en/admin";
              router.replace(adminUrl);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        // Continue to show identification screen if there's an error
      }
    };

    checkUserStatus();
    fetchRoles();
  }, [router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
      if (!STRAPI_URL) {
        throw new Error(
          "NEXT_PUBLIC_STRAPI_URL environment variable is not set"
        );
      }

      // Get authentication token
      const token = Cookies.get("auth_token");
      if (!token) {
        setError(t("auth_token_error"));
        setIsLoading(false);
        return;
      }

      // Decode JWT to get user ID and email
      let userId: number;
      let userEmail: string;

      try {
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error(t("invalid_token_error"));
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        userId = payload.id;
        userEmail = payload.email;

        // Se email não estiver no token, buscar via API
        if (!userEmail) {
          const userResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            userEmail = userData.email;
          }
        }
      } catch {
        setError(t("token_decode_error"));
        setIsLoading(false);
        return;
      }

      // Buscar por mentor primeiro (se CPF for fornecido)
      if (identifier) {
        const mentorRes = await fetch(
          `${STRAPI_URL}/api/mentores?filters[cpf_id][$eq]=${identifier}&locale=pt-BR`,
          {
            headers: {
              // Authorization: `Bearer ${token}`,
            },
          }
        );

        if (mentorRes.ok) {
          const mentorData = await mentorRes.json();

          if (mentorData.data && mentorData.data.length > 0) {
            const mentor = mentorData.data[0];

            // Buscar role de mentor
            const mentorRole = roles?.roles?.find(
              (r: Role) => r.type === "mentor"
            );
            if (!mentorRole) {
              setError(t("mentor_role_error"));
              setIsLoading(false);
              return;
            }

            // Vincular usuário ao mentor
            const updateRes = await fetch("/api/users/update-role", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId,
                roleId: mentorRole.id,
                mentorId: mentor.id,
              }),
            });

            if (updateRes.ok) {
              const adminUrl = locale === "pt" ? "/pt/admin" : "/en/admin";
              router.replace(adminUrl);
              return;
            } else {
              const errorData = await updateRes.json().catch(() => ({}));
              setError(
                t("update_role_error", {
                  error: errorData.error || "Erro desconhecido",
                })
              );
              setIsLoading(false);
              return;
            }
          }
        }
      }

      // Se não encontrou mentor, buscar por aluno
      // Primeiro por CPF (se fornecido)
      let studentRes;
      if (identifier) {
        studentRes = await fetch(
          `${STRAPI_URL}/api/alunos?filters[cpf_aluno][$eq]=${identifier}`,
          {
            headers: {
              // Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Verificar se encontrou aluno por CPF
      let studentFound = false;
      let studentData = null;

      if (studentRes && studentRes.ok) {
        studentData = await studentRes.json();
        studentFound = studentData.data && studentData.data.length > 0;
      }

      // Se não encontrou por CPF, buscar por email do usuário logado
      if (!studentFound && userEmail) {
        const emailStudentRes = await fetch(
          `${STRAPI_URL}/api/alunos?filters[email_responsavel][$eq]=${userEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (emailStudentRes.ok) {
          const emailStudentData = await emailStudentRes.json();
          studentFound =
            emailStudentData.data && emailStudentData.data.length > 0;
          if (studentFound) {
            studentData = emailStudentData;
          }
        }
      }

      // Se não encontrou aluno em nenhuma busca
      if (!studentFound) {
        setError(t("not_found_error"));
        setIsLoading(false);
        return;
      }

      // Processar o aluno encontrado
      if (studentData && studentData.data && studentData.data.length > 0) {
        const student = studentData.data[0];

        // Buscar role de student
        const studentRole = roles?.roles?.find(
          (r: Role) => r.type === "student"
        );
        if (!studentRole) {
          setError(t("student_role_error"));
          setIsLoading(false);
          return;
        }

        // Vincular usuário ao aluno

        const updateRes = await fetch("/api/users/update-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            roleId: studentRole.id,
            studentId: student.id,
          }),
        });

        if (updateRes.ok) {
          await updateRes.json();

          // Aguardar um momento para a atualização propagar
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Redirecionar para o dashboard de student
          const studentUrl = locale === "pt" ? "/pt/student" : "/en/student";
          router.replace(studentUrl);
          return;
        } else {
          const errorData = await updateRes.json().catch(() => ({}));
          setError(
            t("update_role_error", {
              error: errorData.error || "Erro desconhecido",
            })
          );
          setIsLoading(false);
          return;
        }
      }

      // If not found anywhere
      setError(t("not_found_error"));
    } catch {
      setError(t("generic_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("page_title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("page_description")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier">{t("identifier_label")}</Label>
              <Input
                id="identifier"
                type="text"
                placeholder={t("identifier_placeholder")}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="text-center text-lg"
              />
            </div>

            <div className="text-sm text-gray-600 text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <User className="h-4 w-4" />
                <span>{t("mentor_text")}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{t("student_text")}</span>
              </div>
            </div>
          </CardContent>

          <div className="px-6 pb-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  {t("identifying")}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  {t("identify_button")}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
