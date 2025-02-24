import { notFound } from "next/navigation";

import BreweryBeerList from "@/app/[locale]/(business)/breweries/[brewerySlug]/_components/brewery-beer-list";
import BreweryCard from "@/app/[locale]/(business)/breweries/[brewerySlug]/_components/brewery-card";
import ReplacePathname from "@/app/_components/replace-pathname";
import { getBreweryBySlug } from "@/domain/breweries";
import { publicConfig } from "@/lib/config/client-config";
import prisma from "@/lib/prisma";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

export async function generateStaticParams() {
  const breweries = await prisma.breweries.findMany();

  return breweries
    .map((brewery) => [
      { brewerySlug: brewery.slug.slice(0, 4) },
      { brewerySlug: brewery.slug },
    ])
    .flat();
}

interface BreweryPageProps {
  params: Promise<{
    brewerySlug: string;
  }>;
}

export async function generateMetadata({ params }: BreweryPageProps) {
  const { brewerySlug } = await params;

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => notFound());

  return {
    title: `${brewery.name} | ${publicConfig.appName}`,
  };
}

const BreweryPage = async ({ params }: BreweryPageProps) => {
  const { brewerySlug } = await params;

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => notFound());

  return (
    <div className="flex flex-col gap-y-8 p-8">
      {brewery.slug !== brewerySlug ? (
        <ReplacePathname
          pathname={generatePath(Routes.BREWERY, {
            brewerySlug: brewery.slug,
          })}
        />
      ) : null}

      <BreweryCard name={brewery.name} country={brewery.country} />

      <BreweryBeerList breweryId={brewery.id} brewerySlug={brewerySlug} />
    </div>
  );
};

export default BreweryPage;
