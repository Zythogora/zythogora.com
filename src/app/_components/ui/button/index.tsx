import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/tailwind";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  [
    "shadow-hard relative m-0.5 flex w-[calc(100%-theme(spacing.1))] min-w-0 cursor-pointer flex-row items-center justify-center gap-x-2 rounded-md font-bold transition-[bottom,box-shadow] duration-300",
    "text-sm md:text-base",
    "bottom-0 hover:bottom-0.5 hover:[--hard-shadow-depth:4px]",
    "focus-visible:outline-offset-2",
    "focus-visible:hover:bottom-0 focus-visible:hover:[--hard-shadow-depth:2px]",
    "disabled:pointer-events-none disabled:cursor-default",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary-400 text-stone-950 transition-[bottom,box-shadow,background-color] selection:bg-stone-950/15 dark:[--hard-shadow-color:var(--color-primary-700)]",
        outline: "bg-background dark:bg-stone-700",
        ghost:
          "text-foreground [--hard-shadow-color:transparent] hover:bottom-0",
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

interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  children,
  asChild,
  ...restProps
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...restProps}
    >
      {children}
    </Comp>
  );
};

export default Button;
