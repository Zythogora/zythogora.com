"use client";

import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteReviewAction } from "@/app/[locale]/(business)/(without-header)/users/[username]/reviews/[reviewSlug]/_components/delete-review-dialog/actions";
import Button from "@/app/_components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/app/_components/ui/responsive-dialog";
import { useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface DeleteReviewButtonProps {
  reviewId: string;
  username: string;
}

const DeleteReviewButton = ({
  reviewId,
  username,
}: DeleteReviewButtonProps) => {
  const t = useTranslations();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleRemoveReview = async () => {
    startTransition(async () => {
      const result = await deleteReviewAction(reviewId);

      if (result.success) {
        toast.success(t("reviewPage.actions.remove.success"));
        router.push(generatePath(Routes.PROFILE, { username }));
      } else {
        toast.error(t(result.translationKey));
      }
    });
  };

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button
          title={t("reviewPage.actions.remove.title")}
          aria-label={t("reviewPage.actions.remove.title")}
          variant="destructive"
          size="icon"
          className="shrink-0"
        >
          <Trash2Icon size={24} className="size-6" />
        </Button>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent dismissible={!isPending}>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {t("reviewPage.actions.remove.title")}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {t("reviewPage.actions.remove.description")}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              {t("reviewPage.actions.remove.cancel")}
            </Button>
          </ResponsiveDialogClose>

          <Button
            onClick={handleRemoveReview}
            variant="destructive"
            disabled={isPending}
          >
            {isPending
              ? t("reviewPage.actions.remove.pending")
              : t("reviewPage.actions.remove.remove")}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default DeleteReviewButton;
