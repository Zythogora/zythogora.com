import CountryFlag from "@/app/_components/icons/country-flag";
import type { Beer } from "@/domain/beers/types";
import { cn } from "@/lib/tailwind";

interface ReviewFormHeaderProps {
  beer: Beer;
  className?: string;
}

const ReviewFormHeader = ({ beer, className }: ReviewFormHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-y-6 overflow-hidden px-12 py-14 drop-shadow",
        "border-b-2 md:rounded md:border-2",
        "bg-primary-50 dark:bg-primary-800",
        className,
      )}
    >
      <h1 className={cn("text-center", "text-3xl @3xl:text-4xl")}>
        {beer.name}
      </h1>

      <div
        className={cn("flex flex-row items-center", "gap-x-1.5 @3xl:gap-x-2")}
      >
        <CountryFlag
          country={beer.brewery.country}
          size={14}
          className="size-3 @3xl:size-3.5"
        />

        <p className="text-sm @3xl:text-base">{beer.brewery.name}</p>
      </div>
    </div>
  );
};

export default ReviewFormHeader;
