import { setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CourseExchangeForm from "@/app/components/CourseExchangeForm";
import { useTranslations } from "next-intl";

export default function CourseExchangePage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations("CourseExchange");

  return (
    <div className="overflow-x-hidden">
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("page_title")}
              </h1>
              <p className="text-lg text-gray-600">{t("page_subtitle")}</p>
            </div>
            <CourseExchangeForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
