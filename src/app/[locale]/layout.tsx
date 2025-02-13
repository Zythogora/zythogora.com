import { Inter, Kanit } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import LocaleSwitcher from "@/app/_components/locale-switcher";
import { routing } from "@/lib/i18n";

import type { Locale } from "@/lib/i18n";
import type { PropsWithChildren } from "react";

import "@/app/globals.css";

const title = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-title",
  subsets: ["latin"],
});

const paragraph = Inter({
  variable: "--font-paragraph",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: "metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  params,
  children,
}: Readonly<
  PropsWithChildren<{
    params: Promise<{ locale: Locale }>;
  }>
>) {
  const locale = (await params).locale;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${title.variable} ${paragraph.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LocaleSwitcher />

          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
