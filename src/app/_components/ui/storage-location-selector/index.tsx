"use client";

import { Command } from "cmdk";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Button from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import type { StorageLocation } from "@/domain/storage-locations/types";
import { cn } from "@/lib/tailwind";

import type { getSelectProps } from "@conform-to/react";
import type { ComponentProps } from "react";

interface StorageLocationSelectorProps
  extends Partial<ReturnType<typeof getSelectProps>>,
    Pick<ComponentProps<"input">, "placeholder" | "disabled" | "className"> {
  locations: StorageLocation[];
  selectedLocationId?: string | null;
  onChange?: (location: StorageLocation | null) => void;
  onCreateNew?: (name: string) => Promise<StorageLocation>;
}

const StorageLocationSelector = ({
  locations,
  selectedLocationId,
  onChange,
  onCreateNew,
  placeholder,
  className,
  ...restProps
}: StorageLocationSelectorProps) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const selectedLocation = locations.find(
    (loc) => loc.id === selectedLocationId,
  );

  const handleCreateNew = async () => {
    if (!newLocationName.trim() || !onCreateNew) return;

    setIsCreating(true);
    try {
      const newLocation = await onCreateNew(newLocationName.trim());
      onChange?.(newLocation);
      setNewLocationName("");
      setOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...restProps}
          data-slot="storage-location-selector-trigger"
          variant="outline"
          aria-expanded={open}
          role="combobox"
          value={selectedLocation?.id}
          className={cn(
            "group/storage-location-selector-trigger font-medium",
            "justify-between pr-4",
            "hover:bottom-0 hover:before:-bottom-1",
            "aria-invalid:before:bg-destructive",
            className,
          )}
        >
          {selectedLocation ? (
            <div className="flex min-w-0 flex-row items-center gap-x-3">
              <p className="truncate">{selectedLocation.name}</p>
            </div>
          ) : (
            <span className="text-foreground-muted">{placeholder}</span>
          )}

          <ChevronDownIcon
            size={24}
            className={cn(
              "shrink-0 transition-transform duration-300",
              "group-aria-expanded/storage-location-selector-trigger:-scale-y-100",
              "group-aria-invalid/storage-location-selector-trigger:text-destructive",
            )}
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        alignOffset={-2}
        sideOffset={8}
        className="w-full max-w-[calc(100vw-theme(spacing.16))] min-w-[calc(var(--radix-popper-anchor-width)+theme(spacing.1))] p-0"
      >
        <Command data-slot="storage-location-selector">
          <Command.List
            data-slot="storage-location-selector-list"
            className={cn(
              "scroll-py-1 overflow-x-hidden overflow-y-auto rounded-t",
              "max-h-48",
              "bg-background dark:bg-stone-700",
              "*:[&[cmdk-list-sizer]]:flex *:[&[cmdk-list-sizer]]:flex-col *:[&[cmdk-list-sizer]]:p-2",
            )}
          >
            {locations.length === 0 ? (
              <div className={cn("px-3 py-2 text-foreground-muted", "text-sm")}>
                {t("cellar.form.storageLocation.noLocations")}
              </div>
            ) : (
              <Command.Group>
                {/* Option to clear selection */}
                <Command.Item
                  data-slot="storage-location-selector-item"
                  value="__none__"
                  onSelect={() => {
                    onChange?.(null);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex min-w-0 flex-row items-center gap-x-3 rounded px-3 py-2 select-none",
                    "text-sm text-foreground-muted italic",
                    "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                  )}
                >
                  <p className="truncate">
                    {t("cellar.form.storageLocation.none")}
                  </p>

                  {!selectedLocation ? (
                    <CheckIcon size={16} className="ml-auto" />
                  ) : null}
                </Command.Item>

                {locations.map((location) => (
                  <Command.Item
                    data-slot="storage-location-selector-item"
                    key={location.id}
                    value={location.id}
                    keywords={[location.name]}
                    onSelect={() => {
                      onChange?.(location);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex min-w-0 flex-row items-center gap-x-3 rounded px-3 py-2 select-none",
                      "text-sm md:text-base",
                      "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                      "data-[disabled=true]:bg-background-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                    )}
                  >
                    <p className="truncate">{location.name}</p>

                    {selectedLocation?.id === location.id ? (
                      <CheckIcon size={16} className="ml-auto" />
                    ) : null}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          {onCreateNew ? (
            <div
              data-slot="storage-location-selector-add-new"
              className={cn(
                "flex items-center gap-x-2 border-t-2 px-3 py-2",
                "bg-background dark:bg-stone-700",
              )}
            >
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder={t("cellar.form.storageLocation.addNewPlaceholder")}
                className={cn(
                  "flex-1 rounded px-2 py-1.5 outline-hidden",
                  "text-sm",
                  "bg-transparent",
                  "border border-foreground/20 focus:border-primary",
                  "placeholder:text-foreground-muted",
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateNew();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!newLocationName.trim() || isCreating}
                onClick={handleCreateNew}
                className="shrink-0 px-2 py-1.5"
              >
                <PlusIcon size={16} />
              </Button>
            </div>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StorageLocationSelector;
