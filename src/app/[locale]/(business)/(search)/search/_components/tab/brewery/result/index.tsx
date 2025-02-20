import { getTranslations } from "next-intl/server";

import CountryFlag from "@/app/_components/icons/country-flag";

interface BrewerySearchResultProps {
  name: string;
  location: {
    country: {
      name: string;
      code: string;
    };
  };
  beerCount: number;
}

const BrewerySearchResult = async ({
  name,
  location,
  beerCount,
}: BrewerySearchResultProps) => {
  const t = await getTranslations();

  return (
    <div className="flex grow flex-col gap-y-2">
      <p className="font-title text-lg leading-none">{name}</p>

      <div className="flex flex-row gap-x-1">
        <CountryFlag
          country={location.country}
          size={14}
          className="size-3.5"
        />

        <p className="text-foreground/62.5 text-sm leading-none">
          {location.country.name}
        </p>
      </div>

      <p className="flex flex-row gap-x-1.5 text-xs leading-none">
        <span className="bg-foreground/7.5 text-foreground/62.5 rounded-full px-2 py-1">
          {t("searchPage.breweries.result.beerCount", { count: beerCount })}
        </span>
      </p>
    </div>
  );
};

export default BrewerySearchResult;
