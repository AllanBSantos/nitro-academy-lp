import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Faq() {
  const t = useTranslations("Faq");
  const locale = useLocale();
  return (
    <div className="bg-theme-orange py-20 shadow-[inset_0px_-12px_0px_0px_#19184b] rounded-b-2xl">
      <p className="font-montserrat-black text-4xl text-background text-center pb-14">
        {t("Dúvidas?")}
      </p>
      <div className="flex justify-center">
        <Link href={`/${locale}/faq/`}>
          <Button
            size="lg"
            className="bg-background text-white hover:bg-background/90 font-bold text-lg px-8 py-4"
          >
            {t("Acesse a nossa página de dúvidas frequentes")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
