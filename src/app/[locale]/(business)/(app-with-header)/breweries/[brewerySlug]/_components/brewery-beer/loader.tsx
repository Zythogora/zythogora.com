import PintIcon from "@/app/_components/icons/pint";
import Chip from "@/app/_components/ui/chip";

interface BreweryBeerLoaderProps {
  nameLength: number;
  styleLength: number;
  hasIbu?: boolean;
}

const BreweryBeerLoader = ({
  nameLength,
  styleLength,
  hasIbu = false,
}: BreweryBeerLoaderProps) => {
  return (
    <div className="flex w-full min-w-0 animate-pulse flex-row items-center gap-x-4">
      <PintIcon
        color={{ name: "", hex: "999999" }}
        size={40}
        className="size-10"
      />

      <div className="flex flex-col gap-y-1 overflow-hidden">
        <div
          className="bg-foreground/25 mt-1.5 mb-1 h-4.5 max-w-full rounded-full"
          style={{ width: `${nameLength}ch` }}
        />

        <div className="flex flex-row gap-x-1.5">
          <Chip className="h-6" style={{ width: `${styleLength}ch` }} />

          <Chip className="h-6 w-10" />

          {hasIbu ? <Chip className="h-6 w-10" /> : null}
        </div>
      </div>
    </div>
  );
};

export default BreweryBeerLoader;
