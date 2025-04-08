import { cn } from "@/lib/tailwind";

import type { ReactNode } from "react";

interface HomeSmallCardProps {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}

const HomeSmallCard = ({ icon, title, description }: HomeSmallCardProps) => {
  return (
    <div
      className={cn(
        "bg-background grid rounded border-2 px-16 py-12 drop-shadow",
        "col-span-1 row-span-3 max-md:grid-rows-subgrid",
        "md:col-span-2 md:row-span-2 md:max-lg:grid-cols-subgrid",
        "lg:col-span-1 lg:row-span-3 lg:grid-rows-subgrid",
      )}
    >
      <div
        className={cn(
          "relative size-32 place-self-center",
          "[&>svg]:stroke-foreground [&>svg]:fill-primary [&>svg]:size-full [&>svg]:stroke-3",
        )}
      >
        {icon}
      </div>

      <h3 className="-my-6 self-center text-center text-2xl font-bold">
        {title}
      </h3>

      <p
        className={cn(
          "mt-8 self-start text-justify",
          "md:col-start-2 md:row-span-2 md:row-start-1",
          "lg:col-start-1 lg:row-span-1 lg:row-start-3",
        )}
      >
        {description}
      </p>
    </div>
  );
};

export default HomeSmallCard;
