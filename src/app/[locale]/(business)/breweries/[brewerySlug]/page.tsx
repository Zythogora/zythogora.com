import { notFound } from "next/navigation";

import BreweryCard from "@/app/[locale]/(business)/breweries/[brewerySlug]/_components/brewery-card";
import ReplacePathname from "@/app/_components/replace-pathname";
import { getBreweryBySlug } from "@/domain/breweries";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface BreweryPageProps {
  params: Promise<{
    brewerySlug: string;
  }>;
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
    </div>
  );
};

export default BreweryPage;
