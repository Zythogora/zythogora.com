"use client";

import UserIcon from "@/app/_components/icons/user";
import Button from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import LanguageSubMenu from "@/app/_components/user-menu/language-submenu";
import ThemeSubMenu from "@/app/_components/user-menu/theme-submenu";
import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

export const UserMenuTrigger = ({
  className,
  ...restProps
}: ComponentProps<typeof Button>) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "relative size-9 rounded-full before:rounded-full",
        "hover:bg-primary hover:w-9 hover:translate-x-0 hover:translate-y-0 hover:before:w-9 hover:before:translate-y-0.5",
        "focus-visible:bg-primary focus-visible:w-9 focus-visible:translate-x-0 focus-visible:translate-y-0 focus-visible:before:w-9 focus-visible:before:translate-y-0.5",
        className,
      )}
      {...restProps}
    >
      <UserIcon size={24} className="fill-foreground rounded-full" />
    </Button>
  );
};

const UserMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserMenuTrigger />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        align="end"
        sideOffset={24}
        alignOffset={-8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <LanguageSubMenu />

        <ThemeSubMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
