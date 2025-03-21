"use client";

import { LoaderCircleIcon, UserPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { addFriend } from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-header/add-friend/actions";
import Button from "@/app/_components/ui/button";
import { useRouter } from "@/lib/i18n";
import { cn } from "@/lib/tailwind";

interface AddFriendButtonProps {
  friendId: string;
  className?: string;
}

const AddFriendButton = ({ friendId, className }: AddFriendButtonProps) => {
  const t = useTranslations();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleFriendRequest = () => {
    startTransition(async () => {
      const { success } = await addFriend(friendId);

      if (success) {
        toast.success(t("profilePage.friendship.toasts.friendRequestSent"));
        router.refresh();
      } else {
        toast.error(
          t("profilePage.friendship.toasts.friendRequestSendingError"),
        );
      }
    });
  };

  return (
    <div className={cn("isolate", className)}>
      <Button
        onClick={handleFriendRequest}
        disabled={isPending}
        variant="outline"
      >
        {isPending ? (
          <LoaderCircleIcon size={16} className="size-4 animate-spin" />
        ) : (
          <UserPlusIcon size={16} className="size-4" />
        )}

        <span className="text-sm">
          {t("profilePage.friendship.actions.addFriend")}
        </span>
      </Button>
    </div>
  );
};

export default AddFriendButton;
