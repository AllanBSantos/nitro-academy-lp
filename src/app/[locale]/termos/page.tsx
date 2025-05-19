import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TermsPTBR from "@/app/[locale]/termos/termsPtBr";
import TermsEN from "@/app/[locale]/termos/termsEn";

export default async function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Terms" });

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-gilroy-extrabold sm:text-6xl mb-8 text-orange-600">
          {t("title")}
        </h1>
        <p className="text-lg mb-8">
          {locale === "pt"
            ? "Última atualização: 19 de maio 2025"
            : "Last update: May 19, 2025"}
        </p>

        {locale === "pt" ? <TermsPTBR /> : <TermsEN />}
      </div>
      <section className="bg-background">
        <Footer />
      </section>
    </div>
  );
}
