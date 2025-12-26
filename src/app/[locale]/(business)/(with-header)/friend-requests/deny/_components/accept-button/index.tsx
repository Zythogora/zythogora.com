"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { acceptPreviouslyRejectedFriendRequestAction } from "@/app/[locale]/(business)/(with-header)/friend-requests/actions";
import { useRouterWithSearchParams } from "@/lib/i18n/hooks";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

interface AcceptButtonProps {
  friendRequestId: string;
}

const AcceptButton = ({ friendRequestId }: AcceptButtonProps) => {
  const t = useTranslations();

  const { push } = useRouterWithSearchParams();

  const [isPending, startTransition] = useTransition();

  const handleAcceptFriendRequest = () => {
    startTransition(async () => {
      const result =
        await acceptPreviouslyRejectedFriendRequestAction(friendRequestId);

      if (result.success) {
        push(Routes.ACCEPT_FRIEND_REQUEST, { id: friendRequestId });
      } else {
        toast.error(t(result.translationKey));
      }
    });
  };

  return (
    <button
      onClick={handleAcceptFriendRequest}
      disabled={isPending}
      className={cn(
        "underline",
        "text-primary-700 disabled:text-primary",
        "cursor-pointer disabled:cursor-not-allowed",
      )}
    >
      {isPending
        ? t("friendRequestPage.actions.accept.rejecting")
        : t("friendRequestPage.actions.accept.label")}
    </button>
  );
};

export default AcceptButton;
