"use client";

import { CheckIcon, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { availableThemes } from "@/app/_components/providers/theme-provider";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/app/_components/ui/dropdown-menu";

const ThemeSubMenu = () => {
  const t = useTranslations();

  const { theme: selectedTheme = "system", setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex flex-row gap-x-2">
        {selectedTheme === "dark" ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )}

        <span>{t("userMenu.theme.menuLabel")}</span>
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent>
        {["system" as const, ...availableThemes].map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setTheme(theme)}
            disabled={theme === selectedTheme}
          >
            <span>{t(`userMenu.theme.${theme}`)}</span>

            {theme === selectedTheme && (
              <DropdownMenuShortcut className="ml-auto size-4">
                <CheckIcon />
              </DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default ThemeSubMenu;
