import CountryFlag from "@/app/_components/icons/country-flag";
import PintIcon from "@/app/_components/icons/pint";
import { getCountryName } from "@/lib/i18n/countries";

import type { CSSProperties } from "react";

interface BeerSearchResultProps {
  name: string;
  brewery: {
    name: string;
    countryCode: string;
  };
  style: string;
  abv: number;
  ibu?: number;
  color?: string;
}

const BeerSearchResult = async ({
  name,
  brewery,
  style,
  abv,
  ibu,
  color,
}: BeerSearchResultProps) => {
  return (
    <div className="flex w-full flex-row items-center gap-x-4">
      {color ? (
        <PintIcon
          size={40}
          className="size-10"
          beerFillClassName="fill-[var(--beer-color)]"
          style={{ "--beer-color": `#${color}` } as CSSProperties}
        />
      ) : (
        <PintIcon size={40} className="size-10" unknownColor />
      )}

      <div className="flex grow flex-col gap-y-2">
        <p className="font-title text-lg leading-none">{name}</p>

        <div className="flex flex-row gap-x-1">
          <CountryFlag
            country={{
              name: await getCountryName(brewery.countryCode),
              code: brewery.countryCode,
            }}
            size={14}
            className="size-3.5"
          />

          <p className="text-foreground/62.5 text-sm leading-none">
            {brewery.name}
          </p>
        </div>

        <p className="flex flex-row gap-x-1.5 text-xs leading-none">
          <span className="bg-foreground/7.5 text-foreground/62.5 rounded-full px-2 py-1">
            {style}
          </span>

          <span className="bg-foreground/7.5 text-foreground/62.5 rounded-full px-2 py-1">
            {abv}%
          </span>

          {ibu ? (
            <span className="bg-foreground/7.5 text-foreground/62.5 rounded-full px-2 py-1">
              {ibu} IBU
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
};

export default BeerSearchResult;
