"use client";

import { EllipsisVerticalIcon, Link, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { publicConfig } from "@/lib/config/client-config";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

interface UserMoreProps {
  username: string;
  isFriend: boolean;
  className?: string;
}

const UserMore = ({ username, className }: UserMoreProps) => {
  const t = useTranslations();

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${publicConfig.baseUrl}${generatePath(Routes.PROFILE, {
        username,
      })}`,
    );
    toast.success(t("common.actions.copiedToClipboard"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("m-3 cursor-pointer rounded p-2", className)}>
          <EllipsisVerticalIcon size={24} className="size-6" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          "**:data-[slot=menuitem-with-icon]:flex **:data-[slot=menuitem-with-icon]:flex-row **:data-[slot=menuitem-with-icon]:items-center **:data-[slot=menuitem-with-icon]:gap-x-2",
          "**:data-[slot=menuitem-icon]:text-foreground **:data-[slot=menuitem-icon]:size-4",
        )}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger data-slot="menuitem-with-icon">
            <Share2Icon data-slot="menuitem-icon" size={16} />

            <span>{t("profilePage.menu.shareProfile.label")}</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            <DropdownMenuItem
              data-slot="menuitem-with-icon"
              onClick={handleShare}
            >
              <Link data-slot="menuitem-icon" size={16} />

              <span>{t("profilePage.menu.shareProfile.actions.copyUrl")}</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* {isFriend ? (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              data-slot="menuitem-with-icon"
              onClick={handleRemoveFriend}
            >
              <Trash2Icon data-slot="menuitem-icon" size={16} />

              <span>{t("profilePage.menu.removeFriend.label")}</span>
            </DropdownMenuItem>
          </>
        ) : null} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMore;
