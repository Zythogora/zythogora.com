import { cn } from "@/lib/tailwind";

import type { IconProps } from "@/app/_components/icons/types";
import type { ReactNode } from "react";

interface HomeLargeCardProps {
  text: ReactNode;
  Icon: (props: IconProps) => ReactNode;
  iconClassName: string;
}

const HomeLargeCard = ({ Icon, text, iconClassName }: HomeLargeCardProps) => {
  return (
    <div
      className={cn(
        "group/home-large-card",
        "border-foreground bg-background grid rounded border-2 drop-shadow",
        "row-span-2 grid-cols-none grid-rows-subgrid px-8 py-12",
        "sm:px-12 sm:py-16",
        "lg:p-20",
        "xl:col-span-3 xl:grid-cols-subgrid xl:grid-rows-none xl:px-32 xl:py-24",
      )}
    >
      <Icon
        size={192}
        className={cn(
          "place-self-center overflow-visible",
          "size-20 md:size-32 xl:size-48",
          "xl:group-odd/home-large-card:order-last xl:group-even/home-large-card:order-first",
          iconClassName,
        )}
      />

      <p
        className={cn(
          "self-center",
          "text-justify text-base hyphens-auto",
          "sm:text-left sm:text-lg",
          "lg:text-xl",
          "xl:col-span-2",
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default HomeLargeCard;
