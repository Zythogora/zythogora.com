"use client";

import { LogInIcon, LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import UserIcon from "@/app/_components/icons/user";
import Button from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import LanguageSubMenu from "@/app/_components/user-menu/language-submenu";
import ThemeSubMenu from "@/app/_components/user-menu/theme-submenu";
import { authClient } from "@/lib/auth/client";
import { usePathname } from "@/lib/i18n";
import { useRouterWithSearchParams } from "@/lib/i18n/hooks";
import { Routes } from "@/lib/routes";
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
        "relative size-9 shrink-0 rounded-full before:rounded-full",
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
  const t = useTranslations();

  const { data: session } = authClient.useSession();

  const { push } = useRouterWithSearchParams();
  const pathname = usePathname();

  const handleSignIn = () => {
    push(Routes.SIGN_IN, { redirect: pathname });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
  };

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
        {session ? (
          <>
            <DropdownMenuLabel className="flex flex-col gap-y-2 p-2">
              <p className="truncate text-lg font-bold">
                {session.user.username}
              </p>

              <div className="flex flex-row justify-between">
                <p className="text-sm leading-none">
                  {t.rich("userMenu.beers", {
                    count: 0, // FIXME: Get the actual number of beers
                    muted: (chunks) => (
                      <span className="text-foreground/62.5">{chunks}</span>
                    ),
                  })}
                </p>

                <p className="text-sm leading-none">
                  {t.rich("userMenu.reviews", {
                    count: 0, // FIXME: Get the actual number of reviews
                    muted: (chunks) => (
                      <span className="text-foreground/62.5">{chunks}</span>
                    ),
                  })}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
          </>
        ) : null}

        <DropdownMenuGroup>
          <LanguageSubMenu />

          <ThemeSubMenu />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {session ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex flex-row gap-x-2"
            >
              <LogOutIcon className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleSignIn}
              className="flex flex-row gap-x-2"
            >
              <LogInIcon className="size-4" />
              Sign in
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
