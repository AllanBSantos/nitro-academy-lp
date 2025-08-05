"use client";

import { useEffect, useState } from "react";
import { fetchPartnerSchools, PartnerSchool } from "@/lib/strapi";
import Image from "next/image";

interface PartnerSchoolsProps {
  locale: string;
}

export default function PartnerSchools({ locale }: PartnerSchoolsProps) {
  const [schools, setSchools] = useState<PartnerSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        setError(null);
        const partnerSchools = await fetchPartnerSchools(locale);
        setSchools(partnerSchools);
      } catch (error) {
        console.error("Error loading partner schools:", error);
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, [locale]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {locale === "pt" ? "Nossos Clientes" : "Our Clients"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === "pt"
                ? "Conheça as instituições que confiam na Nitro Academy para formar os futuros profissionais de tecnologia"
                : "Meet the institutions that trust Nitro Academy to train the future technology professionals"}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {locale === "pt" ? "Nossos Clientes" : "Our Clients"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === "pt"
                ? "Conheça as instituições que confiam na Nitro Academy"
                : "Meet the institutions that trust Nitro Academy"}
            </p>
          </div>
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (schools.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === "pt" ? "Nossos Clientes" : "Our Clients"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {locale === "pt"
              ? "Conheça as instituições que confiam na Nitro Academy"
              : "Meet the institutions that trust Nitro Academy"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-center justify-items-center">
          {schools.map((school) => (
            <div
              key={school.id}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[120px] w-full max-w-[200px]"
            >
              {school.logo ? (
                <div className="relative w-full h-20 mb-4">
                  <Image
                    src={`${
                      process.env.NEXT_PUBLIC_STRAPI_URL ||
                      "http://localhost:1337"
                    }${school.logo.url}`}
                    alt={school.logo.alternativeText || school.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gray-500 text-xl font-bold">
                    {school.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <h3 className="text-sm font-medium text-gray-900 text-center">
                {school.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
