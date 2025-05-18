"use client";

import {
  LogInIcon,
  LogOutIcon,
  UserPenIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import DiscordIcon from "@/app/_components/icons/social/types/discord";
import UserIcon from "@/app/_components/icons/user";
import Button from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import LanguageSubMenu from "@/app/_components/user-menu/language-submenu";
import ThemeSubMenu from "@/app/_components/user-menu/theme-submenu";
import { authClient } from "@/lib/auth/client";
import { usePathname, useRouter } from "@/lib/i18n";
import { useRouterWithSearchParams } from "@/lib/i18n/hooks";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
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
        "size-10 shrink-0 rounded-full before:rounded-full",
        // Disable default button hover effects
        "transition-none hover:bottom-0 hover:before:-bottom-1",
        // Add the outline on hover
        "hover:outline-primary hover:outline-3 hover:outline-offset-2",
        className,
      )}
      {...restProps}
    >
      <UserIcon size={24} className="fill-foreground rounded-full" />
    </Button>
  );
};

interface UserMenuProps {
  className?: string;
}

const UserMenu = ({ className }: UserMenuProps) => {
  const t = useTranslations();

  const { data: session } = authClient.useSession();

  const router = useRouter();
  const { push } = useRouterWithSearchParams();
  const pathname = usePathname();

  const handleViewProfile = () => {
    if (session) {
      router.push(
        generatePath(Routes.PROFILE, { username: session.user.username }),
      );
    }
  };

  const handleEditProfile = () => {
    if (session) {
      router.push(
        generatePath(Routes.EDIT_PROFILE, { username: session.user.username }),
      );
    }
  };

  const handleSignIn = () => {
    push(Routes.SIGN_IN, { redirect: pathname });
  };

  const handleSignUp = () => {
    push(Routes.SIGN_UP, { redirect: pathname });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserMenuTrigger className={className} />
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
            <DropdownMenuItem
              onClick={handleViewProfile}
              className="flex flex-col gap-y-2 p-4"
            >
              <p className="truncate text-lg font-bold">
                {session.user.username}
              </p>

              <div className="flex w-full flex-row justify-between gap-x-4">
                <p className="text-sm leading-none">
                  {t.rich("userMenu.user.reviews", {
                    count: session.user.reviewCount,
                    muted: (chunks) => (
                      <span className="text-foreground/62.5">{chunks}</span>
                    ),
                  })}
                </p>

                <p className="text-right text-sm leading-none">
                  {t.rich("userMenu.user.beers", {
                    count: session.user.uniqueBeerCount,
                    muted: (chunks) => (
                      <span className="text-foreground/62.5">{chunks}</span>
                    ),
                  })}
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        ) : null}

        <DropdownMenuGroup>
          <LanguageSubMenu />

          <ThemeSubMenu />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="items-start" asChild>
          <a href="https://discord.gg/wejRt3kWvT" target="_blank">
            <DiscordIcon
              size={16}
              className="fill-foreground mt-0.5 size-4 shrink-0"
            />

            <p className="flex flex-col">
              {t.rich("userMenu.discord", {
                br: () => <br />,
              })}
            </p>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {session ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleEditProfile}
              className="flex flex-row gap-x-2"
            >
              <UserPenIcon className="text-foreground size-4" />

              {t("userMenu.auth.editProfile")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex flex-row gap-x-2"
            >
              <LogOutIcon className="text-foreground size-4" />

              {t("userMenu.auth.signOut")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleSignUp}
              className="flex flex-row gap-x-2"
            >
              <UserRoundPlusIcon className="text-foreground size-4" />

              {t("userMenu.auth.signUp")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleSignIn}
              className="flex flex-row gap-x-2"
            >
              <LogInIcon className="text-foreground size-4" />

              {t("userMenu.auth.signIn")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
