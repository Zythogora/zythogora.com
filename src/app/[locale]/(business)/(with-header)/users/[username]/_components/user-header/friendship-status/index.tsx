"use client";

import {
  HeartCrackIcon,
  HeartHandshakeIcon,
  MailWarningIcon,
} from "lucide-react";
import { ClockFadingIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import Chip from "@/app/_components/ui/chip";
import type { FriendshipStatus as FriendshipStatusValues } from "@/domain/users/types";
import { cn } from "@/lib/tailwind";

interface FriendshipStatusProps {
  status: Exclude<FriendshipStatusValues, "NOT_FRIENDS">;
  className?: string;
}

const FriendshipStatus = ({ status, className }: FriendshipStatusProps) => {
  const t = useTranslations();

  const Icon = {
    FRIENDS: HeartHandshakeIcon,
    PENDING_APPROVAL: ClockFadingIcon,
    REQUEST_RECEIVED: MailWarningIcon,
    REQUEST_REJECTED: HeartCrackIcon,
  }[status];

  return (
    <Chip
      className={cn("flex w-fit flex-row items-center gap-x-1.5", className)}
    >
      <Icon size={14} className="size-3.5 shrink-0" />

      <span>{t(`profilePage.friendship.status.${status}`)}</span>
    </Chip>
  );
};

export default FriendshipStatus;
