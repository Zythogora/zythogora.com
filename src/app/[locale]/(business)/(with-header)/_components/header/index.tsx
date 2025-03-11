"use client";

import HeaderSearchBar from "@/app/[locale]/(business)/(with-header)/_components/header/search-bar";
import UserMenu from "@/app/_components/user-menu";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

const Header = () => {
  return (
    <div
      className={cn(
        "border-foreground z-50 w-full flex-row items-center gap-x-6 border-b bg-stone-50 px-8 py-6 drop-shadow dark:bg-stone-900",
        "flex md:grid md:grid-cols-[1fr_calc(var(--spacing)*128)_1fr]",
      )}
    >
      <Link
        href={Routes.HOME}
        className={cn(
          "font-title text-2xl font-semibold tracking-wide uppercase",
          "hidden md:block",
          "invisible w-0 lg:visible lg:w-auto",
        )}
      >
        Zythogora
      </Link>

      <HeaderSearchBar className="grow md:w-128 md:grow-0" />

      <UserMenu className="md:justify-self-end" />
    </div>
  );
};

export default Header;
