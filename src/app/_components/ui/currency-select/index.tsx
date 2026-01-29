"use client";

import { Command } from "cmdk";
import { data as currencies } from "currency-codes";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useEffect } from "react";

import Button from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from "@/lib/tailwind";

import type { getSelectProps } from "@conform-to/react";
import type { ComponentProps } from "react";

// These currencies are excluded because they are not real currencies
// (metals like silver or gold, testing, non-country specific, etc.)
const EXCLUDED_CURRENCY_CODES = [
  "XAG",
  "XAU",
  "XBA",
  "XBB",
  "XBC",
  "XBD",
  "XDR",
  "XPD",
  "XPT",
  "XSU",
  "XTS",
  "XUA",
  "XXX",
];

const CURRENCY_LIST = currencies
  .filter(({ code }) => !EXCLUDED_CURRENCY_CODES.includes(code))
  .map(({ code, currency, countries }) => ({ code, currency, countries }))
  .sort((a, b) => a.code.localeCompare(b.code));

type Currency = {
  code: string;
  currency: string;
};

interface CurrencySelectProps
  extends
    Partial<ReturnType<typeof getSelectProps>>,
    Pick<ComponentProps<"input">, "disabled" | "className"> {
  onChange?: (value: Currency) => void;
  defaultValue?: string;
}

const CurrencySelect = ({
  onChange,
  className,
  defaultValue,
  ...restProps
}: CurrencySelectProps) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    () => {
      if (defaultValue) {
        const currency = CURRENCY_LIST.find((c) => c.code === defaultValue);
        return currency
          ? { code: currency.code, currency: currency.currency }
          : null;
      }
      return null;
    },
  );

  useEffect(() => {
    if (defaultValue) {
      const currency = CURRENCY_LIST.find((c) => c.code === defaultValue);
      if (currency) {
        setSelectedCurrency(currency);
      }
    } else {
      setSelectedCurrency(null);
    }
  }, [defaultValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...restProps}
          data-slot="currency-select-trigger"
          variant="outline"
          aria-expanded={open}
          role="combobox"
          value={selectedCurrency?.code}
          className={cn(
            "group/currency-select-trigger font-medium",
            "justify-between pr-4",
            "hover:bottom-0 hover:before:-bottom-1",
            "aria-invalid:before:bg-destructive",
            className,
          )}
        >
          {selectedCurrency ? (
            <span className="font-mono text-sm">{selectedCurrency.code}</span>
          ) : null}

          <ChevronDownIcon
            size={24}
            className={cn(
              "shrink-0 transition-transform duration-300",
              "group-aria-expanded/currency-select-trigger:-scale-y-100",
              "group-aria-invalid/currency-select-trigger:text-destructive",
            )}
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        alignOffset={-2}
        sideOffset={8}
        className="w-full max-w-[calc(100vw-(--spacing(16)))] min-w-[calc(var(--radix-popper-anchor-width)+(--spacing(1)))] p-0"
      >
        <Command
          data-slot="currency-select"
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
            data-slot="currency-select-input-container"
            className={cn(
              "flex items-center gap-x-3 rounded-t border-b-2 px-5 py-4 drop-shadow",
              "bg-background dark:bg-stone-700",
            )}
          >
            <SearchIcon className="size-5 shrink-0" />

            <Command.Input
              data-slot="currency-select-input"
              className={cn(
                "flex w-full rounded outline-hidden",
                "text-sm md:text-base",
                "disabled:bg-background-muted disabled:pointer-events-none disabled:cursor-not-allowed",
                "placeholder:text-foreground-muted",
              )}
            />
          </div>

          <Command.List
            data-slot="currency-select-list"
            className={cn(
              "scroll-py-1 overflow-x-hidden overflow-y-auto rounded",
              "max-h-52 md:max-h-72",
              "bg-background dark:bg-stone-700",
              "*:[[cmdk-list-sizer]]:p-2",
            )}
          >
            <Command.Empty className={cn("px-3 py-2", "text-sm md:text-base")}>
              {t("form.fields.currencySelect.noResult")}
            </Command.Empty>

            {CURRENCY_LIST.map((currency) => (
              <Command.Item
                data-slot="currency-select-item"
                key={currency.code}
                value={currency.code}
                keywords={[
                  currency.code,
                  currency.currency,
                  ...currency.countries,
                ]}
                onSelect={() => {
                  onChange?.(currency);
                  setSelectedCurrency(currency);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-w-0 flex-row items-center gap-x-3 rounded px-3 py-2 select-none",
                  "text-sm md:text-base",
                  "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                  "data-[disabled=true]:bg-background-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                )}
              >
                <p className="truncate font-mono text-sm">{currency.code}</p>

                <p className="truncate">{currency.currency}</p>

                {selectedCurrency?.code === currency.code ? (
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

export default CurrencySelect;
