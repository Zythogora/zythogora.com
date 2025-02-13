"use client";

import dynamic from "next/dynamic";

import { availableThemes } from "@/app/_components/providers/theme-provider";

// This is required because SSR on the button component will cause hydration errors
// because the theme returns undefined on the server.
const ThemeButton = dynamic(() => import("./theme-button"), { ssr: false });

const ThemeSwitcher = () => {
  return (
    <div className="absolute top-20 right-8 flex flex-row gap-x-2">
      {["system" as const, ...availableThemes].map((theme) => (
        <ThemeButton key={theme} theme={theme} />
      ))}
    </div>
  );
};

export default ThemeSwitcher;
