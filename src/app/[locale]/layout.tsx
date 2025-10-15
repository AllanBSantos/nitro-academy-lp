import { routing } from "@/i18n/routing";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import { setRequestLocale } from "next-intl/server";
import { LayoutWrapper } from "@/components/LayoutWrapper";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </NextIntlClientProvider>
  );
}
