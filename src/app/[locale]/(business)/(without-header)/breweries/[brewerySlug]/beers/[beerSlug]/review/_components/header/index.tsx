import CountryFlag from "@/app/_components/icons/country-flag";
import { cn } from "@/lib/tailwind";

import type { Beer } from "@/domain/beers/types";

interface ReviewFormHeaderProps {
  beer: Beer;
  className?: string;
}

const ReviewFormHeader = ({ beer, className }: ReviewFormHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-y-4 overflow-hidden px-12 drop-shadow",
        "border-b-2 py-16 md:rounded md:border-2 md:py-20",
        "bg-primary-50 dark:bg-primary-800",
        className,
      )}
    >
      <h1 className="text-3xl @3xl:text-4xl">{beer.name}</h1>

      <div
        className={cn("flex flex-row items-center", "gap-x-1.5 @3xl:gap-x-2")}
      >
        <CountryFlag
          country={beer.brewery.country}
          size={14}
          className="size-3 @3xl:size-3.5"
        />

        <p className="text-base @3xl:text-lg">{beer.brewery.name}</p>
      </div>
    </div>
  );
};

export default ReviewFormHeader;
