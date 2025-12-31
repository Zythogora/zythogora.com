"use client";

import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import CountryFlag from "@/app/_components/icons/country-flag";
import { searchAction } from "@/app/_components/ui/brewery-select/actions";
import Button from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import type { BreweryResult } from "@/domain/search/types";
import { Link, useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

import type { getSelectProps } from "@conform-to/react";
import type { ComponentProps } from "react";

interface BrewerySelectProps
  extends
    Partial<ReturnType<typeof getSelectProps>>,
    Pick<ComponentProps<"input">, "placeholder" | "disabled" | "className"> {
  onChange?: (value: BreweryResult) => void;
  searchPlaceholder?: string;
  popoverId?: string;
}

const BrewerySelect = ({
  onChange,
  placeholder,
  searchPlaceholder,
  className,
  popoverId,
  ...restProps
}: BrewerySelectProps) => {
  const t = useTranslations();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [breweries, setBreweries] = useState<BreweryResult[]>([]);
  const [selectedBrewery, setSelectedBrewery] = useState<BreweryResult | null>(
    null,
  );

  const { isPending, data } = useQuery({
    queryFn: () => searchAction(search),
    queryKey: ["search", search],
    staleTime: 15_000,
  });

  useEffect(() => {
    if (data && Array.isArray(data.results)) {
      setBreweries(data.results);
    }
  }, [data]);

  const debouncedSearch = useDebouncedCallback(
    (search: string) => setSearch(search),
    300,
  );

  const contentId = popoverId ? `${popoverId}-content` : undefined;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            {...restProps}
            data-slot="brewery-select-trigger"
            variant="outline"
            aria-expanded={open}
            aria-controls={contentId}
            role="combobox"
            value={selectedBrewery?.id}
            className={cn(
              "group/brewery-select-trigger font-medium",
              "justify-between pr-4",
              "hover:bottom-0 hover:before:-bottom-1",
              "aria-invalid:before:bg-destructive",
              className,
            )}
          >
            {selectedBrewery ? (
              <div className="flex min-w-0 flex-row items-center gap-x-3">
                <p className="truncate">{selectedBrewery.name}</p>
              </div>
            ) : (
              <span className="text-foreground-muted">{placeholder}</span>
            )}

            <ChevronDownIcon
              size={24}
              className={cn(
                "shrink-0 transition-transform duration-300",
                "group-aria-expanded/brewery-select-trigger:-scale-y-100",
                "group-aria-invalid/brewery-select-trigger:text-destructive",
              )}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          id={contentId}
          align="start"
          alignOffset={-2}
          sideOffset={8}
          className="w-full max-w-[calc(100vw-(--spacing(16)))] min-w-[calc(var(--radix-popper-anchor-width)+(--spacing(1)))] p-0"
        >
          <Command data-slot="brewery-select" shouldFilter={false}>
            <div
              data-slot="brewery-select-input-container"
              className={cn(
                "flex items-center gap-x-3 rounded-t border-b-2 px-5 py-4 drop-shadow",
                "bg-background dark:bg-stone-700",
              )}
            >
              <SearchIcon className="size-5 shrink-0" />

              <Command.Input
                data-slot="brewery-select-input"
                placeholder={searchPlaceholder}
                onValueChange={debouncedSearch}
                className={cn(
                  "flex w-full rounded outline-hidden",
                  "text-sm md:text-base",
                  "disabled:bg-background-muted disabled:pointer-events-none disabled:cursor-not-allowed",
                  "placeholder:text-foreground-muted",
                )}
              />
            </div>

            <Command.List
              data-slot="brewery-select-list"
              className={cn(
                "scroll-py-1 overflow-x-hidden overflow-y-auto rounded",
                "max-h-72 md:max-h-80",
                "bg-background dark:bg-stone-700",
                "*:[[cmdk-list-sizer]]:p-2",
                "**:[[cmdk-empty]]:px-3 **:[[cmdk-empty]]:py-2",
              )}
            >
              {isPending && search === "" ? (
                <Command.Empty>
                  {t("form.fields.brewerySelect.pending")}
                </Command.Empty>
              ) : search === "" ? (
                <Command.Empty>
                  {t("form.fields.brewerySelect.searchPlaceholder")}
                </Command.Empty>
              ) : breweries.length === 0 ? (
                <Command.Empty>
                  {t("form.fields.brewerySelect.noResult")}
                </Command.Empty>
              ) : (
                <div>
                  <p className="px-3 py-2">
                    {t("form.fields.brewerySelect.resultCount", {
                      count: breweries.length,
                    })}
                  </p>

                  {breweries.map((brewery) => (
                    <Command.Item
                      data-slot="brewery-select-item"
                      key={brewery.id}
                      value={brewery.id}
                      keywords={[brewery.name]}
                      onSelect={() => {
                        onChange?.(brewery);
                        setSelectedBrewery(brewery);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex min-w-0 flex-row items-center gap-x-3 rounded px-3 py-2 select-none",
                        "text-sm md:text-base",
                        "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                        "data-[disabled=true]:bg-background-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                      )}
                    >
                      <div className="flex grow flex-col">
                        <p className="font-title truncate text-lg">
                          {brewery.name}
                        </p>

                        <div className="flex flex-row gap-x-1">
                          <CountryFlag
                            country={brewery.country}
                            size={14}
                            className="size-3.5"
                          />

                          <p className="text-foreground/62.5 text-sm leading-none">
                            {brewery.country.name}
                          </p>
                        </div>
                      </div>

                      {selectedBrewery?.id === brewery.id ? (
                        <CheckIcon size={16} className="ml-auto" />
                      ) : null}
                    </Command.Item>
                  ))}
                </div>
              )}

              {!isPending && search !== "" ? (
                <Command.Item
                  onSelect={() =>
                    router.push(
                      `${Routes.CREATE_BREWERY}?redirect=${Routes.CREATE_BEER}`,
                    )
                  }
                  data-slot="brewery-select-item"
                  className={cn(
                    "rounded px-3 py-2",
                    "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                  )}
                >
                  <Link
                    href={`${Routes.CREATE_BREWERY}?redirect=${Routes.CREATE_BEER}`}
                    className="text-primary-700 dark:text-primary underline"
                  >
                    {t("form.fields.brewerySelect.create")}
                  </Link>
                </Command.Item>
              ) : null}
            </Command.List>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default BrewerySelect;
