import { cn } from "@/lib/tailwind";

import type { HTMLAttributes, ReactNode } from "react";

interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  label: string;
  value: ReactNode;
}

const DescriptionList = ({
  label,
  value,
  className,
  ...restProps
}: DescriptionListProps) => {
  return (
    <dl
      data-slot="description-list"
      className={cn(
        "flex flex-col items-start",
        "gap-y-0 md:gap-y-0.5",
        className,
      )}
      {...restProps}
    >
      <dt
        data-slot="description-term"
        className={cn(
          "font-title uppercase opacity-50",
          "text-[10px] md:text-xs",
        )}
      >
        {label}
      </dt>

      <dd
        data-slot="description-details"
        className={cn("text-left", "text-xs md:text-sm")}
      >
        {value}
      </dd>
    </dl>
  );
};

export default DescriptionList;
