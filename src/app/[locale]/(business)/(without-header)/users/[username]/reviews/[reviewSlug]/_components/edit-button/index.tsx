"use client";

import { Loader2Icon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import Button from "@/app/_components/ui/button";
import { useRouter } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface EditButtonProps {
  username: string;
  reviewSlug: string;
}

const EditButton = ({ username, reviewSlug }: EditButtonProps) => {
  const t = useTranslations();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleRedirect = () => {
    startTransition(async () => {
      router.push(
        generatePath(Routes.EDIT_REVIEW, {
          username,
          reviewSlug,
        }),
      );
    });
  };

  return (
    <Button
      onClick={handleRedirect}
      disabled={isPending}
      variant="outline"
      size="icon"
      className="shrink-0"
    >
      {isPending ? (
        <Loader2Icon
          size={24}
          className="size-6 animate-spin"
          aria-label="edit review"
        />
      ) : (
        <PencilIcon size={24} className="size-6" aria-label="edit review" />
      )}
    </Button>
  );
};

export default EditButton;
