"use client";

import { Command } from "cmdk";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Button from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import type { Style, StyleCategory } from "@/domain/beers/types";
import { cn } from "@/lib/tailwind";

import type { getSelectProps } from "@conform-to/react";
import type { ComponentProps } from "react";

interface StyleSelectProps
  extends
    Partial<ReturnType<typeof getSelectProps>>,
    Pick<ComponentProps<"input">, "placeholder" | "disabled" | "className"> {
  styleCategories: StyleCategory[];
  onChange?: (value: Style) => void;
  searchPlaceholder?: string;
  popoverId?: string;
}

const StyleSelect = ({
  styleCategories,
  onChange,
  placeholder,
  searchPlaceholder,
  className,
  popoverId,
  ...restProps
}: StyleSelectProps) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

  const contentId = popoverId ? `${popoverId}-content` : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...restProps}
          data-slot="style-select-trigger"
          variant="outline"
          aria-expanded={open}
          aria-controls={contentId}
          role="combobox"
          value={selectedStyle?.id}
          className={cn(
            "group/style-select-trigger font-medium",
            "justify-between pr-4",
            "hover:bottom-0 hover:before:-bottom-1",
            "aria-invalid:before:bg-destructive",
            className,
          )}
        >
          {selectedStyle ? (
            <div className="flex min-w-0 flex-row items-center gap-x-3">
              <p className="truncate">{selectedStyle.name}</p>
            </div>
          ) : (
            <span className="text-foreground-muted">{placeholder}</span>
          )}

          <ChevronDownIcon
            size={24}
            className={cn(
              "shrink-0 transition-transform duration-300",
              "group-aria-expanded/style-select-trigger:-scale-y-100",
              "group-aria-invalid/style-select-trigger:text-destructive",
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
        <Command
          data-slot="style-select"
          filter={(_, search, keywords) => {
            if (
              keywords &&
              keywords.some((keyword) =>
                keyword.toLowerCase().includes(search.toLowerCase()),
              )
            ) {
              return 1;
            }

            return 0;
          }}
        >
          <div
            data-slot="style-select-input-container"
            className={cn(
              "flex items-center gap-x-3 rounded-t border-b-2 px-5 py-4 drop-shadow",
              "bg-background dark:bg-stone-700",
            )}
          >
            <SearchIcon className="size-5 shrink-0" />

            <Command.Input
              data-slot="style-select-input"
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
            data-slot="style-select-list"
            className={cn(
              "scroll-py-1 overflow-x-hidden overflow-y-auto rounded",
              "max-h-64 md:max-h-72",
              "bg-background dark:bg-stone-700",
              "*:[[cmdk-list-sizer]]:flex *:[[cmdk-list-sizer]]:flex-col *:[[cmdk-list-sizer]]:gap-y-1 *:[[cmdk-list-sizer]]:p-2",
              "**:[[cmdk-group-heading]]:text-foreground-muted **:[[cmdk-group-heading]]:pb-1",
              "**:[[cmdk-group-heading]]:text-sm md:**:[[cmdk-group-heading]]:text-base",
            )}
          >
            <Command.Empty className={cn("px-3 py-2", "text-sm md:text-base")}>
              {t("form.fields.styleSelect.noResult")}
            </Command.Empty>

            {styleCategories.map((category) => (
              <Command.Group
                key={category.id}
                heading={category.name}
                className="flex flex-col px-3 py-2"
              >
                {category.styles.map((style) => (
                  <Command.Item
                    data-slot="style-select-item"
                    key={style.id}
                    value={style.id}
                    keywords={[category.name, style.name]}
                    onSelect={() => {
                      onChange?.(style);
                      setSelectedStyle(style);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex min-w-0 flex-row items-center gap-x-3 rounded px-3 py-2 select-none",
                      "text-sm md:text-base",
                      "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                      "data-[disabled=true]:bg-background-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                    )}
                  >
                    <p className="truncate">{style.name}</p>

                    {selectedStyle?.id === style.id ? (
                      <CheckIcon size={16} className="ml-auto" />
                    ) : null}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StyleSelect;
