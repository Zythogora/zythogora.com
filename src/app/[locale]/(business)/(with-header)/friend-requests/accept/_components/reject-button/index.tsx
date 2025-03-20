"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { rejectPreviouslyAcceptedFriendRequestAction } from "@/app/[locale]/(business)/(with-header)/friend-requests/actions";
import { useRouterWithSearchParams } from "@/lib/i18n/hooks";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

interface RejectButtonProps {
  friendRequestId: string;
}

const RejectButton = ({ friendRequestId }: RejectButtonProps) => {
  const t = useTranslations();

  const { push } = useRouterWithSearchParams();

  const [isPending, startTransition] = useTransition();

  const handleRejectFriendRequest = () => {
    startTransition(async () => {
      const { success } =
        await rejectPreviouslyAcceptedFriendRequestAction(friendRequestId);

      if (success) {
        push(Routes.DENY_FRIEND_REQUEST, { id: friendRequestId });
      } else {
        toast.error(t("friendRequestPage.errors.friendRequestRejectingError"));
      }
    });
  };

  return (
    <button
      onClick={handleRejectFriendRequest}
      disabled={isPending}
      className={cn(
        "underline",
        "text-primary-700 disabled:text-primary",
        "cursor-pointer disabled:cursor-not-allowed",
      )}
    >
      {isPending
        ? t("friendRequestPage.actions.reject.rejecting")
        : t("friendRequestPage.actions.reject.label")}
    </button>
  );
};

export default RejectButton;
