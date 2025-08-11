import { setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CourseExchangeForm from "@/app/components/CourseExchangeForm";

export default function CourseExchangePage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <div className="overflow-x-hidden">
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Troca de Curso
              </h1>
              <p className="text-lg text-gray-600">
                Informe seu CPF para buscar seus dados e solicitar a troca de
                curso
              </p>
            </div>
            <CourseExchangeForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
