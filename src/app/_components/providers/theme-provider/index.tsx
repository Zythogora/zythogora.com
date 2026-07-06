"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import type { ComponentProps } from "react";

const ThemeProvider = (props: ComponentProps<typeof NextThemesProvider>) => {
  return <NextThemesProvider {...props} />;
};

export default ThemeProvider;
