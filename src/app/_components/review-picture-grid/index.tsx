import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

import type { ReviewWithPicture } from "@/domain/reviews/types";

interface ReviewPictureGridProps {
  pictures: ReviewWithPicture[];
}

const ReviewPictureGrid = ({ pictures }: ReviewPictureGridProps) => {
  const t = useTranslations();

  if (!pictures.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "mb-4 grid gap-x-3",
        "grid-cols-3 md:grid-cols-5",
        "*:relative *:aspect-square *:overflow-hidden *:rounded-md",
        "*:nth-[n+4]:hidden md:*:nth-[n+4]:block",
      )}
    >
      {pictures.map((review) => (
        <Link
          key={review.id}
          href={generatePath(Routes.REVIEW, {
            username: review.username,
            reviewSlug: review.slug,
          })}
          className={cn(
            "relative aspect-square overflow-hidden rounded border-2",
            "dark:bg-background bg-stone-100",
            "transition duration-150",
            "border-foreground drop-shadow",
            "hover:border-primary hover:[--drop-shadow-color:var(--color-primary)]",
          )}
        >
          <Image
            src={review.pictureUrl}
            alt={t("common.review.pictureAlt", { username: review.username })}
            className="object-cover"
            fill
            unoptimized
          />
        </Link>
      ))}
    </div>
  );
};

export default ReviewPictureGrid;
