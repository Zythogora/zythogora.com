"use client";

import { Command } from "cmdk";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import ColoredPintIcon from "@/app/_components/icons/colored-pint";
import Button from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import type { Color } from "@/domain/beers/types";
import { cn } from "@/lib/tailwind";

import type { getSelectProps } from "@conform-to/react";
import type { ComponentProps } from "react";

interface ColorSelectProps
  extends
    Partial<ReturnType<typeof getSelectProps>>,
    Pick<ComponentProps<"input">, "placeholder" | "disabled" | "className"> {
  colors: Color[];
  onChange?: (value: Color) => void;
  searchPlaceholder?: string;
  popoverId?: string;
}

const ColorSelect = ({
  colors,
  onChange,
  placeholder,
  searchPlaceholder,
  className,
  popoverId,
  ...restProps
}: ColorSelectProps) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const contentId = popoverId ? `${popoverId}-content` : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...restProps}
          data-slot="color-select-trigger"
          variant="outline"
          aria-expanded={open}
          role="combobox"
          value={selectedColor?.id}
          aria-controls={contentId}
          className={cn(
            "group/color-select-trigger font-medium",
            "justify-between pr-4",
            "hover:bottom-0 hover:before:-bottom-1",
            "aria-invalid:before:bg-destructive",
            className,
          )}
        >
          {selectedColor ? (
            <div className="flex min-w-0 flex-row items-center gap-x-3">
              <ColoredPintIcon color={selectedColor} size={20} />

              <p className="truncate">{selectedColor.name}</p>
            </div>
          ) : (
            <span className="text-foreground-muted">{placeholder}</span>
          )}

          <ChevronDownIcon
            size={24}
            className={cn(
              "shrink-0 transition-transform duration-300",
              "group-aria-expanded/color-select-trigger:-scale-y-100",
              "group-aria-invalid/color-select-trigger:text-destructive",
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
          data-slot="color-select"
          filter={(_, search, keywords) => {
            if (
              keywords &&
              keywords.length > 0 &&
              keywords[0]!.toLowerCase().includes(search.toLowerCase())
            ) {
              return 1;
            }

            return 0;
          }}
        >
          <div
            data-slot="color-select-input-container"
            className={cn(
              "flex items-center gap-x-3 rounded-t border-b-2 px-5 py-4 drop-shadow",
              "bg-background dark:bg-stone-700",
            )}
          >
            <SearchIcon className="size-5 shrink-0" />

            <Command.Input
              data-slot="color-select-input"
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
            data-slot="color-select-list"
            className={cn(
              "scroll-py-1 overflow-x-hidden overflow-y-auto rounded",
              "max-h-48",
              "bg-background dark:bg-stone-700",
              "*:[[cmdk-list-sizer]]:p-2",
            )}
          >
            <Command.Empty className={cn("px-3 py-2", "text-sm md:text-base")}>
              {t("form.fields.colorSelect.noResult")}
            </Command.Empty>

            {colors.map((color) => (
              <Command.Item
                data-slot="color-select-item"
                key={color.id}
                value={color.id}
                keywords={[color.name]}
                onSelect={() => {
                  onChange?.(color);
                  setSelectedColor(color);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-w-0 flex-row items-center gap-x-3 rounded px-3 py-2 select-none",
                  "text-sm md:text-base",
                  "data-[selected=true]:outline-primary data-[selected=true]:outline-3 data-[selected=true]:-outline-offset-3",
                  "data-[disabled=true]:bg-background-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
                )}
              >
                <ColoredPintIcon color={color} size={20} />

                <p className="truncate">{color.name}</p>

                {selectedColor?.id === color.id ? (
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

export default ColorSelect;
