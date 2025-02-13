"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { routing, usePathname, useRouter } from "@/lib/i18n";
import { cn } from "@/lib/tailwind";

import type { Locale } from "@/lib/i18n";
import type { TransitionStartFunction } from "react";

interface LocaleButtonProps {
  locale: Locale;
  startTransition: TransitionStartFunction;
  isPending: boolean;
}

const LocaleButton = ({
  locale,
  startTransition,
  isPending,
}: LocaleButtonProps) => {
  const t = useTranslations();

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const selectedLocale = useLocale();

  const localeChange = () => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale },
      );
    });
  };

  return (
    <button
      onClick={() => localeChange()}
      disabled={locale === selectedLocale || isPending}
      className={cn(
        "rounded-full px-4 py-2.5 text-xs",
        locale === selectedLocale
          ? "bg-background border-2 drop-shadow"
          : "cursor-pointer bg-stone-300 dark:bg-stone-600",
      )}
    >
      {t(`locale.${locale}`)}
    </button>
  );
};

const LocaleSwitcher = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="absolute top-8 right-8 flex flex-row gap-x-2">
      {routing.locales.map((locale) => (
        <LocaleButton
          key={locale}
          locale={locale}
          startTransition={startTransition}
          isPending={isPending}
        />
      ))}
    </div>
  );
};

export default LocaleSwitcher;
