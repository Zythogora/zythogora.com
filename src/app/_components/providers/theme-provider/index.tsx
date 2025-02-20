"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import type { ComponentProps } from "react";

export const availableThemes = ["light", "dark"] as const;
export type Theme = (typeof availableThemes)[number] | "system";

const ThemeProvider = ({
  children,
  ...restProps
}: ComponentProps<typeof NextThemesProvider>) => {
  return <NextThemesProvider {...restProps}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
