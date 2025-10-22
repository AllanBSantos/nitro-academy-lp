"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { StudentDashboard } from "@/components/student/StudentDashboard";

export default function StudentPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserRole = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          router.replace(`/${params.locale}/login`);
          return;
        }

        // Verify user role to ensure they have student role and are linked
        const roleResponse = await fetch("/api/auth/verify-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!roleResponse.ok) {
          console.error("Failed to verify user role");
          router.replace(`/${params.locale}/login`);
          return;
        }

        const roleData = await roleResponse.json();

        // Check if user has student role and is linked to a student
        if (roleData.role.type !== "student" || !roleData.studentId) {
          console.error(
            "CRITICAL ERROR: User does not have student role or is not linked to a student",
            {
              timestamp: new Date().toISOString(),
              roleData,
              environment: process.env.NODE_ENV,
            }
          );
          router.replace(`/${params.locale}/login`);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error verifying user role:", error);
        router.replace(`/${params.locale}/login`);
      }
    };

    verifyUserRole();
  }, [router, params.locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f54a12] mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  return <StudentDashboard />;
}
