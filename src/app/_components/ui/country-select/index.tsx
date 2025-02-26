"use client";

import { Command } from "cmdk";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ComponentProps } from "react";

import CountryFlag from "@/app/_components/icons/country-flag";
import Button from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import countries from "@/lib/i18n/countries";
import { cn } from "@/lib/tailwind";

import type { Country } from "@/lib/i18n/countries/types";
import type { getSelectProps } from "@conform-to/react";

interface CountrySelectProps
  extends Partial<ReturnType<typeof getSelectProps>>,
    Pick<ComponentProps<"input">, "placeholder" | "disabled" | "className"> {
  onChange?: (value: Country) => void;
  searchPlaceholder?: string;
}

const CountrySelect = ({
  onChange,
  placeholder,
  searchPlaceholder,
  className,
  ...restProps
}: CountrySelectProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const countryList = Object.entries(countries.getNames(locale))
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...restProps}
          data-slot="country-select-trigger"
          variant="outline"
          aria-expanded={open}
          role="combobox"
          value={selectedCountry?.code}
          className={cn(
            "group/country-select-trigger font-medium",
            "justify-between pr-4",
            "hover:bottom-0 hover:before:-bottom-1",
            "aria-invalid:before:bg-destructive",
            className,
          )}
        >
          {selectedCountry ? (
            <div className="flex min-w-0 flex-row items-center gap-x-3">
              <CountryFlag country={selectedCountry} size={20} />

              <p className="truncate">{selectedCountry.name}</p>
            </div>
          ) : (
            <span className="text-foreground-muted">{placeholder}</span>
          )}

          <ChevronDownIcon
            size={24}
            className={cn(
              "shrink-0 transition-transform duration-300",
              "group-aria-expanded/country-select-trigger:-scale-y-100",
              "group-aria-invalid/country-select-trigger:text-destructive",
            )}
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        alignOffset={-2}
        sideOffset={8}
        className="w-full max-w-[calc(100vw-theme(spacing.16))] min-w-[var(--radix-popper-anchor-width)] p-0"
      >
        <Command
          data-slot="country-select"
          filter={(_, search, keywords) => {
            if (
              keywords &&
              keywords.join(" ").toLowerCase().includes(search.toLowerCase())
            ) {
              return 1;
            }

            return 0;
          }}
        >
          <div
            data-slot="country-select-input-container"
            className={cn(
              "flex items-center gap-x-3 rounded-t border-b-2 px-5 py-4 drop-shadow",
              "bg-background dark:bg-stone-700",
            )}
          >
            <SearchIcon className="size-5 shrink-0" />

            <Command.Input
              data-slot="country-select-input"
              placeholder={searchPlaceholder}
              className={cn(
                "flex w-full rounded outline-hidden",
                "text-sm md:text-base",
                "disabled:bg-background-muted disabled:pointer-events-none disabled:cursor-not-allowed",
                "placeholder:text-foreground-muted",
              )}
            />
          </div>

          <Command.List
            data-slot="country-select-list"
            className={cn(
              "max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto md:max-h-80",
              "bg-background dark:bg-stone-700",
              "*:[&[cmdk-list-sizer]]:p-2",
            )}
          >
            <Command.Empty className={cn("px-3 py-2", "text-sm md:text-base")}>
              {t("form.fields.countrySelect.noResult")}
            </Command.Empty>

            {countryList.map((country) => (
              <Command.Item
                data-slot="country-select-item"
                key={country.code}
                value={country.code}
                keywords={[country.code, country.name]}
                onSelect={() => {
                  onChange?.(country);
                  setSelectedCountry(country);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-w-0 flex-row items-center gap-x-3 rounded px-3 py-2 select-none",
                  "text-sm md:text-base",
                  "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                  "data-[disabled=true]:bg-background-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                )}
              >
                <CountryFlag country={country} size={20} />

                <p className="truncate">{country.name}</p>

                {selectedCountry?.code === country.code ? (
                  <CheckIcon size={16} className="ml-auto" />
                ) : null}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelect;
