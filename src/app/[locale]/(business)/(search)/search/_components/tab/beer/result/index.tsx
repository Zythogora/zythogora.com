import CountryFlag from "@/app/_components/icons/country-flag";
import PintIcon from "@/app/_components/icons/pint";

import type { CSSProperties } from "react";

interface BeerSearchResultProps {
  name: string;
  brewery: {
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
  style: string;
  abv: number;
  ibu?: number;
  color?: string;
}

const BeerSearchResult = ({
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

      <div className="flex flex-col gap-y-1 overflow-hidden">
        <div>
          <p className="font-title truncate text-lg">{name}</p>

          <div className="flex flex-row gap-x-1">
            <CountryFlag
              country={brewery.country}
              size={14}
              className="size-3.5"
            />

            <p className="text-foreground/62.5 truncate text-sm">
              {brewery.name}
            </p>
          </div>
        </div>

        <p className="flex flex-row gap-x-1.5 text-xs">
          <span className="bg-foreground/7.5 text-foreground/62.5 shrink truncate rounded-full px-2 py-1">
            {style}
          </span>

          <span className="bg-foreground/7.5 text-foreground/62.5 w-fit rounded-full px-2 py-1 text-nowrap">
            {abv}%
          </span>

          {ibu ? (
            <span className="bg-foreground/7.5 text-foreground/62.5 w-fit rounded-full px-2 py-1 text-nowrap">
              {ibu} IBU
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
};

export default BeerSearchResult;
