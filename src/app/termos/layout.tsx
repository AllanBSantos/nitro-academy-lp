import { NextIntlClientProvider, useMessages } from "next-intl";
import { PropsWithChildren } from "react";

export default function TermsLayout({
  children,
  params: { locale },
}: PropsWithChildren<{
  params: { locale: string };
}>) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
