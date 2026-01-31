import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/tailwind";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  [
    "m-0.5 flex w-[calc(100%-theme(spacing.1))] min-w-0 cursor-pointer flex-row items-center justify-center gap-x-2 rounded-md font-bold",
    "text-sm md:text-base",
    "before:bg-foreground relative before:absolute before:-inset-0.5 before:z-[-1] before:rounded",
    "bottom-0 transition-[bottom,background-color,color] duration-300 hover:bottom-0.5",
    "before:-bottom-1 before:transition-[bottom,background-color] before:duration-300 hover:before:-bottom-1.5",
    "focus-visible:outline-offset-2",
    "focus-visible:hover:bottom-0 focus-visible:hover:before:-bottom-1",
    "disabled:pointer-events-none disabled:cursor-default",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary-400 dark:before:bg-primary-700 text-stone-950 selection:bg-stone-950/15",
        outline: "bg-background dark:bg-stone-700",
        ghost:
          "text-foreground before:bg-transparent hover:bottom-0 hover:before:bottom-0 focus-visible:hover:bottom-0 focus-visible:hover:before:bottom-0",
        destructive: cn(
          "[--destructive-bg:oklch(0.6333_0.2162_31.5)] hover:[--destructive-bg:oklch(0.6669_0.2131_31.5)]",
          "[--destructive-fg:oklch(0.2846_0.1034_31.5)]",
          "[--destructive-border:oklch(0.361_0.1347_31.5)]",
          "dark:[--destructive-bg:oklch(0.6169_0.2319_28.32)] dark:hover:[--destructive-bg:oklch(0.6404_0.2193_28.32)]",
          "dark:[--destructive-fg:oklch(0.2934_0.1097_28.32)]",
          "dark:[--destructive-border:oklch(0.4434_0.1598_28.32)]",
          "bg-(--destructive-bg) text-(--destructive-fg) before:bg-(--destructive-border)",
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
