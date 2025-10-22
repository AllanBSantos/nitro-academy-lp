"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
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

        // Verify user role to ensure they have admin or mentor role
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

        // Check if user has admin or mentor role
        if (roleData.role.type !== "admin" && roleData.role.type !== "mentor") {
          console.error(
            "CRITICAL ERROR: User does not have admin or mentor role",
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

  return <AdminDashboard />;
}
