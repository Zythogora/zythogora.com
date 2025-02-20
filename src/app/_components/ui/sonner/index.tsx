"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

import type { ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
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
      {...props}
    />
  );
};

export { Toaster };
