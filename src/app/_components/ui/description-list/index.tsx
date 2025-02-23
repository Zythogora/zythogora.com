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
    <dl className={cn("flex flex-col", className)} {...restProps}>
      <dt className="font-title text-xs uppercase opacity-75">{label}</dt>

      <dd className="text-xs">{value}</dd>
    </dl>
  );
};

export default DescriptionList;
