"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Function to extract first and last name
function getFirstAndLastName(fullName: string): string {
  if (!fullName) return "";

  const nameParts = fullName.trim().split(" ");
  if (nameParts.length === 1) return nameParts[0];
  if (nameParts.length === 2) return fullName;

  // More than 2 parts: return first + last
  return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
}

interface User {
  id: number;
  name?: string;
  email?: string;
  role: {
    id: number;
    type: string;
    name: string;
  };
  studentId?: number;
  mentorId?: number;
  adminId?: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Strapi data interfaces
interface StrapiStudent {
  id: number;
  documentId?: string;
  attributes?: {
    nome?: string;
    email_responsavel?: string;
  };
  nome?: string;
  email_responsavel?: string;
}

interface StrapiMentor {
  id: number;
  documentId?: string;
  attributes?: {
    nome?: string;
    email?: string;
  };
  nome?: string;
  email?: string;
}

interface StrapiAdmin {
  id: number;
  documentId?: string;
  attributes?: {
    nome?: string;
    email?: string;
  };
  nome?: string;
  email?: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("auth_token");

        if (!token) {
          setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false,
          });
          return;
        }

        // Verify user role and get user data
        const response = await fetch("/api/auth/verify-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          // Token is invalid, remove it
          Cookies.remove("auth_token");
          setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false,
          });
          return;
        }

        const userData = await response.json();

        // Get additional user information based on role
        const userInfo: User = {
          id: userData.userId,
          role: userData.role,
          studentId: userData.studentId,
          mentorId: userData.mentorId,
          adminId: userData.adminId,
        };

        // Fetch additional user details based on role
        if (userData.role.type === "student" && userData.studentId) {
          try {
            const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
            if (STRAPI_URL) {
              // Strategy 1: Try by ID first
              const studentResponse = await fetch(
                `${STRAPI_URL}/api/alunos/${userData.studentId}`
              );

              if (studentResponse.ok) {
                const studentData = await studentResponse.json();
                const fullName =
                  studentData.data?.attributes?.nome || studentData.data?.nome;
                userInfo.name = getFirstAndLastName(fullName);
                userInfo.email =
                  studentData.data?.attributes?.email_responsavel ||
                  studentData.data?.email_responsavel;
              } else {
                // Strategy 2: Try to get all students and find by ID
                const allStudentsResponse = await fetch(
                  `${STRAPI_URL}/api/alunos?populate=*`
                );

                if (allStudentsResponse.ok) {
                  const allStudentsData = await allStudentsResponse.json();

                  // Find student by ID in the list
                  const foundStudent = allStudentsData.data?.find(
                    (student: StrapiStudent) =>
                      student.id === userData.studentId ||
                      student.documentId === userData.studentId.toString()
                  );

                  if (foundStudent) {
                    const fullName =
                      foundStudent.attributes?.nome || foundStudent.nome;
                    userInfo.name = getFirstAndLastName(fullName);
                    userInfo.email =
                      foundStudent.attributes?.email_responsavel ||
                      foundStudent.email_responsavel;
                  } else {
                    userInfo.name = "Estudante";
                  }
                } else {
                  userInfo.name = "Estudante";
                }
              }
            }
          } catch (error) {
            console.error("Error fetching student data:", error);
            userInfo.name = "Estudante";
          }
        } else if (userData.role.type === "mentor" && userData.mentorId) {
          try {
            const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
            if (STRAPI_URL) {
              // Strategy 1: Try by ID first with locale and publication state
              const mentorResponse = await fetch(
                `${STRAPI_URL}/api/mentores/${userData.mentorId}?locale=pt-BR&publicationState=preview`
              );

              if (mentorResponse.ok) {
                const mentorData = await mentorResponse.json();
                const fullName =
                  mentorData.data?.attributes?.nome || mentorData.data?.nome;
                userInfo.name = getFirstAndLastName(fullName);
                userInfo.email =
                  mentorData.data?.attributes?.email || mentorData.data?.email;
              } else {
                // Strategy 2: Try to get all mentors with locale and publication state
                const allMentorsResponse = await fetch(
                  `${STRAPI_URL}/api/mentores?locale=pt-BR&publicationState=preview&populate=*`
                );

                if (allMentorsResponse.ok) {
                  const allMentorsData = await allMentorsResponse.json();

                  // Find mentor by ID in the list
                  const foundMentor = allMentorsData.data?.find(
                    (mentor: StrapiMentor) =>
                      mentor.id === userData.mentorId ||
                      mentor.documentId === userData.mentorId.toString()
                  );

                  if (foundMentor) {
                    const fullName =
                      foundMentor.attributes?.nome || foundMentor.nome;
                    userInfo.name = getFirstAndLastName(fullName);
                    userInfo.email =
                      foundMentor.attributes?.email || foundMentor.email;
                  } else {
                    userInfo.name = "Mentor";
                  }
                } else {
                  userInfo.name = "Mentor";
                }
              }
            }
          } catch (error) {
            console.error("Error fetching mentor data:", error);
            userInfo.name = "Mentor";
          }
        } else if (userData.role.type === "admin") {
          if (userData.adminId) {
            // WhatsApp admin user - fetch admin data
            try {
              const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
              if (STRAPI_URL) {
                // Strategy 1: Try by ID first
                const adminResponse = await fetch(
                  `${STRAPI_URL}/api/admins/${userData.adminId}`
                );

                if (adminResponse.ok) {
                  const adminData = await adminResponse.json();
                  const fullName =
                    adminData.data?.attributes?.nome ||
                    adminData.data?.nome ||
                    adminData.nome ||
                    adminData.attributes?.nome;

                  userInfo.name = getFirstAndLastName(fullName);
                  userInfo.email =
                    adminData.data?.attributes?.email ||
                    adminData.data?.email ||
                    adminData.email ||
                    adminData.attributes?.email;
                } else {
                  // Strategy 2: Try to get all admins and find by ID
                  const allAdminsResponse = await fetch(
                    `${STRAPI_URL}/api/admins?populate=*`
                  );

                  if (allAdminsResponse.ok) {
                    const allAdminsData = await allAdminsResponse.json();

                    // Find admin by ID in the list
                    const foundAdmin = allAdminsData.data?.find(
                      (admin: StrapiAdmin) =>
                        admin.id === userData.adminId ||
                        admin.documentId === userData.adminId.toString()
                    );

                    if (foundAdmin) {
                      const fullName =
                        foundAdmin.attributes?.nome || foundAdmin.nome;
                      userInfo.name = getFirstAndLastName(fullName);
                      userInfo.email =
                        foundAdmin.attributes?.email || foundAdmin.email;
                    } else {
                      userInfo.name = "Administrador";
                    }
                  } else {
                    userInfo.name = "Administrador";
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching admin data:", error);
              userInfo.name = "Administrador";
            }
          } else {
            // Regular Strapi admin user - extract username from JWT token
            try {
              const token = Cookies.get("auth_token");
              if (token) {
                const tokenParts = token.split(".");
                if (tokenParts.length === 3) {
                  const payload = JSON.parse(atob(tokenParts[1]));
                  const fullName =
                    payload.username ||
                    payload.email?.split("@")[0] ||
                    "Administrador";
                  userInfo.name = getFirstAndLastName(fullName);
                  userInfo.email = payload.email;
                } else {
                  userInfo.name = "Administrador";
                }
              } else {
                userInfo.name = "Administrador";
              }
            } catch (error) {
              console.error("Error extracting username from token:", error);
              userInfo.name = "Administrador";
            }
          }
        }

        setAuthState({
          user: userInfo,
          loading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const logout = (locale?: string) => {
    Cookies.remove("auth_token");
    Cookies.remove("whatsapp_number");
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
    });
    const loginPath = locale ? `/${locale}/login` : "/login";
    router.push(loginPath);
  };

  return {
    ...authState,
    logout,
  };
}
