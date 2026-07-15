import { setRequestLocale } from "next-intl/server";

import HomeContent from "@/app/[locale]/(home)/_components/home-content";
import { getAlternates } from "@/lib/seo";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: getAlternates("/", locale),
  };
}

const HomePage = async ({ params }: PageProps<"/[locale]">) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
};

export default HomePage;
