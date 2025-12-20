"use client";

import { useTranslations } from "next-intl";

import CountryFlag from "@/app/_components/icons/country-flag";
import Chip from "@/app/_components/ui/chip";
import type { Country } from "@/lib/i18n/countries/types";

interface BrewerySearchResultProps {
  name: string;
  location: {
    country: Country;
  };
  beerCount: number;
}

const BrewerySearchResult = ({
  name,
  location,
  beerCount,
}: BrewerySearchResultProps) => {
  const t = useTranslations();

  return (
    <div className="flex grow flex-col gap-y-1">
      <div className="flex grow flex-col">
        <p className="font-title truncate text-lg">{name}</p>

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
      </div>

      <Chip className="w-fit truncate">
        {t("searchPage.brewery.result.beerCount", { count: beerCount })}
      </Chip>
    </div>
  );
};

export default BrewerySearchResult;
