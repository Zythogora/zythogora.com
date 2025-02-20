import { cva } from "class-variance-authority";

import { cn } from "@/lib/tailwind";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  [
    "relative flex origin-bottom cursor-pointer items-center justify-center rounded border-2 text-sm font-bold ring-0 transition-all duration-300 outline-none transform-3d",
    "before:absolute before:size-[calc(100%+4px)] before:translate-y-0.5 before:translate-z-[-1px] before:rounded before:transition-all before:duration-300 before:transform-3d",
    "md:text-base",
    "hover:w-[calc(100%+8px)] hover:-translate-x-1 hover:-translate-y-1 hover:before:translate-y-1.5 hover:before:translate-z-[-1px]",
    "focus-visible:w-[calc(100%+8px)] focus-visible:-translate-x-1 focus-visible:-translate-y-1 focus-visible:before:translate-y-1.5 focus-visible:before:translate-z-[-1px]",
    "disabled:pointer-events-none disabled:cursor-default",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary border-primary-700 before:bg-primary-700 text-stone-950",
        outline: cn(
          "bg-background border-foreground before:bg-foreground dark:bg-stone-700",
        ),
      },
      size: {
        default: "px-5 py-4",
        icon: "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = ({
  className,
  variant,
  size,
  children,
  ...restProps
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) => {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
