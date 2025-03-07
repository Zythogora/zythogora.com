import { useTranslations } from "next-intl";

import ColoredPintIcon from "@/app/_components/icons/colored-pint";
import CountryFlag from "@/app/_components/icons/country-flag";
import Chip from "@/app/_components/ui/chip";

import type { Color } from "@/domain/beers/types";
import type { Country } from "@/lib/i18n/countries/types";

interface BeerSearchResultProps {
  name: string;
  brewery: {
    name: string;
    country: Country;
  };
  style: string;
  abv: number;
  ibu?: number;
  color: Color;
}

const BeerSearchResult = ({
  name,
  brewery,
  style,
  abv,
  ibu,
  color,
}: BeerSearchResultProps) => {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-row items-center gap-x-4">
      <ColoredPintIcon color={color} size={40} className="size-10" />

      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="font-title truncate text-lg">{name}</p>

        <div className="flex flex-row items-center gap-x-1">
          <CountryFlag
            country={brewery.country}
            size={14}
            className="size-3.5"
          />

          <p className="text-foreground/62.5 truncate overflow-visible text-sm leading-none">
            {brewery.name}
          </p>
        </div>

        <div className="flex min-w-0 flex-row gap-x-1.5">
          <Chip className="truncate">{style}</Chip>

          <Chip className="w-fit text-nowrap">{t("common.abv", { abv })}</Chip>

          {ibu ? <Chip className="w-fit text-nowrap">{ibu} IBU</Chip> : null}
        </div>
      </div>
    </div>
  );
};

export default BeerSearchResult;
