import { cva } from "class-variance-authority";

import { cn } from "@/lib/tailwind";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  [
    "left-0.5 flex w-[calc(100%-4px)] min-w-0 cursor-pointer flex-row items-center justify-center gap-x-2 rounded-md font-bold",
    "text-sm md:text-base",
    "before:bg-foreground relative before:absolute before:-inset-0.5 before:z-[-1] before:rounded",
    "bottom-0 transition-[bottom] duration-300 hover:bottom-0.5",
    "before:-bottom-1 before:transition-[bottom] before:duration-300 hover:before:-bottom-1.5",
    "focus-visible:outline-primary focus-visible:outline-3 focus-visible:outline-offset-2",
    "focus-visible:hover:bottom-0 focus-visible:hover:before:-bottom-1",
    "disabled:pointer-events-none disabled:cursor-default",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary-400 text-stone-950 transition-[bottom,background-color] selection:bg-stone-950/15",
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
