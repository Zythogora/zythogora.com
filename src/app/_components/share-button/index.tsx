"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { CopyIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import Button from "@/app/_components/ui/button";
import Input from "@/app/_components/ui/input";
import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

interface ShareButtonProps
  extends Omit<ComponentProps<typeof Button>, "className"> {
  label: string;
  link: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const ShareButton = ({
  label,
  link,
  triggerClassName,
  contentClassName,
  children,
  ...restProps
}: ShareButtonProps) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(link);
    toast.success(t("common.actions.copiedToClipboard"));
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          aria-label={label}
          title={label}
          className={cn(
            "data-[state=open]:hover:bottom-0 data-[state=open]:hover:before:-bottom-1",
            triggerClassName,
          )}
          {...restProps}
        >
          {children ? children : <Share2Icon className="size-6" />}
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          alignOffset={-2}
          sideOffset={8}
          className={cn(
            "border-foreground bg-background rounded border-2 px-5 py-4 drop-shadow",
            contentClassName,
          )}
        >
          <div className="flex flex-col gap-y-2">
            <p>{label}:</p>

            <div className="flex flex-row-reverse items-center gap-x-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="icon"
                className="size-8"
              >
                <CopyIcon className="size-4" />
              </Button>

              <Input
                defaultValue={link}
                className="grow *:data-[slot=input]:px-2 *:data-[slot=input]:py-1"
                readOnly
              />
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default ShareButton;
