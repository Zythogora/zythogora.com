import { ChevronRightIcon } from "lucide-react";

import PintIcon from "@/app/_components/icons/pint";
import Chip from "@/app/_components/ui/chip";

interface BreweryBeerProps {
  name: string;
  style: string;
  abv: number;
  ibu?: number;
  color: {
    name: string;
    hex: string;
  };
}

const BreweryBeer = ({ name, style, abv, ibu, color }: BreweryBeerProps) => {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-x-4">
      <div className="flex min-w-0 flex-row items-center gap-x-4">
        <PintIcon color={color} size={40} className="size-10" />

        <div className="flex flex-col gap-y-1 overflow-hidden">
          <p className="font-title truncate text-lg">{name}</p>

          <div className="flex min-w-0 grow-0 flex-row gap-x-1.5">
            <Chip className="truncate">{style}</Chip>

            <Chip className="w-fit text-nowrap">{abv}%</Chip>

            {ibu ? <Chip className="w-fit text-nowrap">{ibu} IBU</Chip> : null}
          </div>
        </div>
      </div>

      <ChevronRightIcon className="text-foreground/20 size-6 shrink-0" />
    </div>
  );
};

export default BreweryBeer;
