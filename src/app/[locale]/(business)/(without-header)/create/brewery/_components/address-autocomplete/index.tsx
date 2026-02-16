"use client";

import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import { ChevronDownIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import Button from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import type { AutocompleteLocation } from "@/lib/places/types";
import type { PlaceAddressDetails } from "@/lib/places/types";
import { cn } from "@/lib/tailwind";

interface AddressAutocompleteProps {
  getSessionToken: () => string;
  onAddressSelect: (address: PlaceAddressDetails) => void;
  className?: string;
}

const AddressAutocomplete = ({
  getSessionToken,
  onAddressSelect,
  className,
}: AddressAutocompleteProps) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedLocation, setSelectedLocation] =
    useState<AutocompleteLocation | null>(null);

  const { isPending, data } = useQuery({
    queryFn: async () => {
      const response = await fetch(
        `/api/places?${new URLSearchParams({
          search,
          sessionToken: getSessionToken(),
        }).toString()}`,
      );

      return response.ok
        ? (response.json() as Promise<AutocompleteLocation[]>)
        : [];
    },
    queryKey: ["places-autocomplete", search],
    enabled: search.length > 0,
    staleTime: Infinity,
  });

  const debouncedSearch = useDebouncedCallback(
    (search: string) => setSearch(search),
    300,
  );

  const handleSelect = async (location: AutocompleteLocation) => {
    setSelectedLocation(location);
    setOpen(false);

    try {
      const response = await fetch(
        `/api/places/address?${new URLSearchParams({
          placeId: location.placeId,
          sessionToken: getSessionToken(),
        }).toString()}`,
      );

      if (response.ok) {
        const addressDetails =
          (await response.json()) as PlaceAddressDetails;
        onAddressSelect(addressDetails);
      }
    } catch {
      // Silently fail — user can still fill fields manually
    }
  };

  return (
    <div className={cn("flex flex-col gap-y-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            data-slot="address-autocomplete-trigger"
            variant="outline"
            aria-expanded={open}
            aria-controls="address-autocomplete-content"
            role="combobox"
            className={cn(
              "group/address-autocomplete-trigger font-medium",
              "justify-between pr-4",
              "hover:bottom-0 hover:before:-bottom-1",
            )}
          >
            {selectedLocation ? (
              <div className="flex min-w-0 flex-row items-center gap-x-3">
                <MapPinIcon size={16} className="shrink-0" />

                <p className="truncate">
                  {selectedLocation.mainText} ({selectedLocation.secondaryText})
                </p>
              </div>
            ) : (
              <div className="flex min-w-0 flex-row items-center gap-x-3">
                <MapPinIcon size={16} className="shrink-0" />

                <span className="text-foreground-muted truncate">
                  {t("createBreweryPage.fields.addressSearch.placeholder")}
                </span>
              </div>
            )}

            <ChevronDownIcon
              size={24}
              className={cn(
                "shrink-0 transition-transform duration-300",
                "group-aria-expanded/address-autocomplete-trigger:-scale-y-100",
              )}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          id="address-autocomplete-content"
          align="start"
          alignOffset={-2}
          sideOffset={8}
          className="w-full max-w-[calc(100vw-(--spacing(16)))] min-w-[calc(var(--radix-popper-anchor-width)+(--spacing(1)))] p-0"
        >
          <Command
            data-slot="address-autocomplete"
            shouldFilter={false}
          >
            <div
              data-slot="address-autocomplete-input-container"
              className={cn(
                "flex items-center gap-x-3 rounded-t border-b-2 px-5 py-4 drop-shadow",
                "bg-background dark:bg-stone-700",
              )}
            >
              <SearchIcon className="size-5 shrink-0" />

              <Command.Input
                data-slot="address-autocomplete-input"
                placeholder={t(
                  "createBreweryPage.fields.addressSearch.searchPlaceholder",
                )}
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
              data-slot="address-autocomplete-list"
              className={cn(
                "scroll-py-1 overflow-x-hidden overflow-y-auto rounded",
                "bg-background dark:bg-stone-700",
                "*:[[cmdk-list-sizer]]:flex *:[[cmdk-list-sizer]]:flex-col *:[[cmdk-list-sizer]]:p-2",
                "**:[[cmdk-empty]]:px-3 **:[[cmdk-empty]]:py-2",
              )}
            >
              {search === "" ? (
                <Command.Empty>
                  {t(
                    "createBreweryPage.fields.addressSearch.searchPlaceholder",
                  )}
                </Command.Empty>
              ) : isPending ? (
                <Command.Empty>
                  {t("createBreweryPage.fields.addressSearch.pending")}
                </Command.Empty>
              ) : data ? (
                data.length === 0 ? (
                  <Command.Empty>
                    {t("createBreweryPage.fields.addressSearch.noResult")}
                  </Command.Empty>
                ) : (
                  <Command.Group>
                    {data.map((location) => (
                      <Command.Item
                        data-slot="address-autocomplete-item"
                        key={location.placeId}
                        value={location.placeId}
                        keywords={[location.mainText, location.secondaryText]}
                        onSelect={() => handleSelect(location)}
                        className={cn(
                          "flex min-w-0 flex-row items-center gap-x-3 rounded px-3 py-2 select-none",
                          "text-sm md:text-base",
                          "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                          "data-[disabled=true]:bg-background-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                        )}
                      >
                        <div className="flex grow flex-col">
                          <p className="font-title truncate text-lg">
                            {location.mainText}
                          </p>

                          {location.secondaryText ? (
                            <p className="text-foreground/62.5 text-sm leading-none">
                              {location.secondaryText}
                            </p>
                          ) : null}
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )
              ) : null}

              <img
                alt={t("createBreweryPage.fields.addressSearch.attribution")}
                src="/google-maps-attribution.svg"
                className="my-1.5 mr-3 ml-auto h-4"
              />
            </Command.List>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddressAutocomplete;
