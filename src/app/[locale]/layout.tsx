import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Kanit } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import JsonLd from "@/app/_components/json-ld";
import { publicConfig } from "@/lib/config/client-config";
import { routing } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getAbsoluteUrl, getAlternates } from "@/lib/seo";

import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";
import type { WebSite as WebSiteJsonLd, WithContext } from "schema-dts";

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
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const title = t("metadata.title");
  const description = t("metadata.description");

  return {
    metadataBase: new URL(publicConfig.baseUrl),
    alternates: getAlternates("/"),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: publicConfig.appName,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#292526" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  params,
  children,
}: Readonly<PropsWithChildren<{ params: Promise<{ locale: string }> }>>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${title.variable} ${paragraph.variable} antialiased`}>
        <JsonLd
          data={
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: publicConfig.appName,
              url: publicConfig.baseUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: getAbsoluteUrl("/search?search={search}&kind={kind}"),
                // @ts-expect-error - Input constraints support has not been released yet
                "search-input": {
                  "@type": "PropertyValueSpecification",
                  valueName: "search",
                  valueRequired: true,
                },
                "kind-input": {
                  "@type": "PropertyValueSpecification",
                  valueName: "kind",
                  valuePattern: "^{beer|brewery|user}$",
                  defaultValue: "beer",
                },
              },
            } satisfies WithContext<WebSiteJsonLd>
          }
        />

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        <Analytics />

        <SpeedInsights />
      </body>
    </html>
  );
}
