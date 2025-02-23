import CountryFlag from "@/app/_components/icons/country-flag";
import PintIcon from "@/app/_components/icons/pint";
import Chip from "@/app/_components/ui/chip";

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
  color: {
    name: string;
    hex: string;
  };
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
      <PintIcon color={color} size={40} className="size-10" />

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

        <div className="flex min-w-0 flex-row gap-x-1.5">
          <Chip className="truncate">{style}</Chip>

          <Chip className="w-fit text-nowrap">{abv}%</Chip>

          {ibu ? <Chip className="w-fit text-nowrap">{ibu} IBU</Chip> : null}
        </div>
      </div>
    </div>
  );
};

export default BeerSearchResult;
