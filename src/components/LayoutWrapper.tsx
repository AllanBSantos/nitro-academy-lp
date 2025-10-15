"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/new-layout/Navigation";
import { Footer } from "@/components/new-layout/Footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if current path is admin
  const isAdminPage = pathname.includes("/admin");

  return (
    <div className="min-h-screen">
      {!isAdminPage && <Navigation />}
      {children}
      {!isAdminPage && <Footer />}
    </div>
  );
}
