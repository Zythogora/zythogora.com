"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { cn } from "@/lib/tailwind";

import type { Theme } from "@/app/_components/providers/theme-provider";

interface ThemeButtonProps {
  theme: Theme;
}

const ThemeButton = ({ theme }: ThemeButtonProps) => {
  const t = useTranslations();

  const { theme: selectedTheme = "system", setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme)}
      disabled={theme === selectedTheme}
      className={cn(
        "rounded-full px-4 py-2.5 text-xs",
        theme === selectedTheme
          ? "bg-background border-2 drop-shadow"
          : "cursor-pointer bg-stone-300 dark:bg-stone-600",
      )}
    >
      {t(`theme.${theme}`)}
    </button>
  );
};

export default ThemeButton;
