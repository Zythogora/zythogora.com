import Image from "next/image";

import type { IconProps } from "@/app/_components/icons/types";
import type { Country } from "@/lib/i18n/countries/types";
import { cn } from "@/lib/tailwind";

interface CountryFlagProps extends IconProps {
  country: Country;
}

const CountryFlag = ({ country, size, className }: CountryFlagProps) => {
  return (
    <Image
      src={`https://hatscripts.github.io/circle-flags/flags/${country.code.toLowerCase()}.svg`}
      unoptimized
      alt={country.name}
      width={size}
      height={size}
      className={cn("border-foreground rounded-full border", className)}
    />
  );
};

export default CountryFlag;
