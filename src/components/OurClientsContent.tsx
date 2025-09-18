import { useTranslations } from "next-intl";
import SchoolLogo from "./SchoolLogo";
import { Escola } from "@/types/strapi";

interface OurClientsContentProps {
  schools: Escola[];
}

export default function OurClientsContent({ schools }: OurClientsContentProps) {
  const t = useTranslations("OurClients");

  if (!schools || schools.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 items-center justify-items-center">
          {schools.map((school) => (
            <div
              key={school.id}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
            >
              {(() => {
                const logoUrl = school.logo?.url;

                return logoUrl ? (
                  <SchoolLogo
                    logoUrl={logoUrl}
                    schoolName={school.nome}
                    altText={school.nome}
                  />
                ) : (
                  <div className="w-24 h-24 mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">
                      {school.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                );
              })()}
              <h3 className="text-sm font-medium text-gray-900 text-center leading-tight">
                {school.nome}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
