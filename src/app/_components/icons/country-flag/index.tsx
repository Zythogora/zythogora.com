import Image from "next/image";

import { cn } from "@/lib/tailwind";

import type { IconProps } from "@/app/_components/icons/types";

interface CountryFlagProps extends IconProps {
  country: {
    name: string;
    code: string;
  };
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
