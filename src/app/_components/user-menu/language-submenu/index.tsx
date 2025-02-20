"use client";

import { CheckIcon, Globe } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import {
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { routing, usePathname, useRouter } from "@/lib/i18n";

import type { Locale } from "@/lib/i18n";

const LanguageSubMenu = () => {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const selectedLocale = useLocale();

  const localeChange = (locale: Locale) => {
    startTransition(() => {
      router.replace(
        {
          pathname:
            searchParams.size === 0
              ? pathname
              : `${pathname}?${searchParams.toString()}`,
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          params,
        },
        { locale },
      );
    });
  };
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Globe className="mr-2 size-4" />

        <span>{t("locale.menuLabel")}</span>
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent>
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => localeChange(locale)}
            disabled={locale === selectedLocale || isPending}
          >
            <span>{t(`locale.${locale}`)}</span>

            {locale === selectedLocale && (
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

export default LanguageSubMenu;
