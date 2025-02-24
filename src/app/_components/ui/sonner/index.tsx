"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

import type { Theme } from "@/app/_components/providers/theme-provider";
import type { ToasterProps as SonnerProps } from "sonner";

interface ToasterProps extends SonnerProps {
  forceTheme?: Theme;
}

const Toaster = ({ forceTheme, ...restProps }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={forceTheme ?? (theme as ToasterProps["theme"])}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-foreground-muted",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-background-muted group-[.toast]:text-foreground-muted",
          success: "group-[.toast]:bg-green-500 group-[.toast]:text-white",
        },
      }}
      {...restProps}
    />
  );
};

export { Toaster };
