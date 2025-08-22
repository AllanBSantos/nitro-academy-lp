"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface Mentor {
  id: number;
  cpf_id: string;
  nome: string;
}

export default function IdentifyPage() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<RolesResponse | null>(null);
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;
  const isPortuguese = locale === "pt";

  // Fetch available roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/users/list-roles");
        if (response.ok) {
          const rolesData = await response.json();
          setRoles(rolesData);
          console.log("Available roles:", rolesData);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Helper function to get role ID by type
  const getRoleId = (roleType: string) => {
    if (!roles || !roles.roles) return null;

    const role = roles.roles.find((r: Role) => r.type === roleType);
    return role ? role.id : null;
  };

  const getIdentifierLabel = () => {
    return isPortuguese ? "CPF ou ID" : "CPF or ID Number";
  };

  const getIdentifierPlaceholder = () => {
    return isPortuguese
      ? "Digite seu CPF ou ID"
      : "Enter your CPF or ID number";
  };

  const getPageTitle = () => {
    return isPortuguese ? "Identificação" : "Identification";
  };

  const getPageDescription = () => {
    return isPortuguese
      ? "Para completar seu cadastro, informe seu CPF ou ID"
      : "To complete your registration, please provide your CPF or ID number";
  };

  const getMentorText = () => {
    return isPortuguese
      ? "Mentores: acesso aos seus cursos"
      : "Mentors: access to their courses";
  };

  const getStudentText = () => {
    return isPortuguese
      ? "Estudantes: acesso ao dashboard"
      : "Students: access to dashboard";
  };

  const getIdentifyButtonText = () => {
    return isPortuguese ? "Identificar" : "Identify";
  };

  const getIdentifyingText = () => {
    return isPortuguese ? "Identificando..." : "Identifying...";
  };

  const getNotFoundError = () => {
    return isPortuguese
      ? "CPF ou ID não encontrado. Verifique o número informado."
      : "ID number not found. Please check the number provided.";
  };

  const getGenericError = () => {
    return isPortuguese
      ? "Erro ao identificar usuário. Tente novamente."
      : "Error identifying user. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check if roles are loaded
      if (!roles) {
        setError("Carregando roles, aguarde um momento...");
        setIsLoading(false);
        return;
      }

      const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
      if (!STRAPI_URL) {
        throw new Error(
          "NEXT_PUBLIC_STRAPI_URL environment variable is not set"
        );
      }

      // Get role IDs
      const mentorRoleId = getRoleId("mentor");
      const studentRoleId = getRoleId("student");

      if (!mentorRoleId || !studentRoleId) {
        setError(
          "Roles não configurados corretamente. Entre em contato com o administrador."
        );
        setIsLoading(false);
        return;
      }

      // Get authentication token
      const token = Cookies.get("auth_token");
      if (!token) {
        setError("Token de autenticação não encontrado");
        setIsLoading(false);
        return;
      }

      // First, try to find by CPF in mentors
      console.log("Searching for mentor with CPF/ID:", identifier);

      // Debug: Fetch all mentors to see what's in the database
      const allMentorsRes = await fetch(
        `${STRAPI_URL}/api/mentores?populate=*&locale=pt-BR`,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      if (allMentorsRes.ok) {
        const allMentors = await allMentorsRes.json();
        console.log("All mentors in database:", allMentors.data);
        console.log(
          "CPF/ID values:",
          allMentors.data?.map((m: Mentor) => m.cpf_id)
        );
      }

      const mentorRes = await fetch(
        `${STRAPI_URL}/api/mentores?filters[cpf_id][$eq]=${identifier}&locale=pt-BR`,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Mentor search response status:", mentorRes.status);

      if (mentorRes.ok) {
        const mentorData = await mentorRes.json();
        console.log("Mentor search response:", mentorData);
        console.log("Mentors found:", mentorData.data?.length || 0);

        if (mentorData.data && mentorData.data.length > 0) {
          const mentor = mentorData.data[0];
          console.log("Found mentor:", mentor);

          // Decode JWT to get user ID
          try {
            const tokenParts = token.split(".");
            if (tokenParts.length !== 3) {
              throw new Error("Token inválido");
            }

            const payload = JSON.parse(atob(tokenParts[1]));
            const userId = payload.id;

            console.log("User ID from token:", userId);

            // Update user role to mentor using our API route
            const updateRes = await fetch("/api/users/update-role", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId,
                roleId: mentorRoleId,
                mentorId: mentor.id,
              }),
            });

            if (updateRes.ok) {
              // Redirect to admin with mentor context
              const adminUrl = isPortuguese
                ? "/pt/admin?mentor=true"
                : "/en/admin?mentor=true";
              router.replace(adminUrl);
              return;
            } else {
              const errorData = await updateRes.json().catch(() => ({}));
              console.error("Error updating mentor role:", errorData);
              setError(
                `Erro ao atualizar role: ${
                  errorData.error || "Erro desconhecido"
                }`
              );
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error decoding token:", error);
            setError("Erro ao decodificar token de autenticação");
            setIsLoading(false);
            return;
          }
        }
      }

      // Only search for students if no mentor was found
      console.log("No mentor found, searching for students...");

      // If not found as mentor, try to find as student
      console.log("Searching for student with CPF/ID:", identifier);
      const studentRes = await fetch(
        `${STRAPI_URL}/api/alunos?filters[cpf_aluno][$eq]=${identifier}`,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Student search response status:", studentRes.status);

      if (studentRes.ok) {
        const studentData = await studentRes.json();
        console.log("Student search response:", studentData);
        console.log("Students found:", studentData.data?.length || 0);

        if (studentData.data && studentData.data.length > 0) {
          const student = studentData.data[0];
          console.log("Found student:", student);

          // Decode JWT to get user ID
          try {
            const tokenParts = token.split(".");
            if (tokenParts.length !== 3) {
              throw new Error("Token inválido");
            }

            const payload = JSON.parse(atob(tokenParts[1]));
            const userId = payload.id;

            console.log("User ID from token:", userId);

            // Update user role to student using our API route
            const updateRes = await fetch("/api/users/update-role", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId,
                roleId: studentRoleId,
                studentId: student.id,
              }),
            });

            if (updateRes.ok) {
              // Redirect to student dashboard or appropriate page
              const studentUrl = isPortuguese ? "/pt/student" : "/en/student";
              router.replace(studentUrl);
              return;
            } else {
              const errorData = await updateRes.json().catch(() => ({}));
              console.error("Error updating student role:", errorData);
              setError(
                `Erro ao atualizar role: ${
                  errorData.error || "Erro desconhecido"
                }`
              );
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error decoding token:", error);
            setError("Erro ao decodificar token de autenticação");
            setIsLoading(false);
            return;
          }
        }
      }

      // If not found anywhere
      console.log("No mentor or student found with CPF/ID:", identifier);
      setError(getNotFoundError());
    } catch (err) {
      console.error("Identification error:", err);
      setError(getGenericError());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {getPageTitle()}
          </CardTitle>
          <CardDescription className="text-center">
            {getPageDescription()}
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
              <Label htmlFor="identifier">{getIdentifierLabel()}</Label>
              <Input
                id="identifier"
                type="text"
                placeholder={getIdentifierPlaceholder()}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="text-center text-lg"
              />
            </div>

            <div className="text-sm text-gray-600 text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <User className="h-4 w-4" />
                <span>{getMentorText()}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{getStudentText()}</span>
              </div>
            </div>
          </CardContent>

          <div className="px-6 pb-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  {getIdentifyingText()}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  {getIdentifyButtonText()}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
