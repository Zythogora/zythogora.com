import { ChevronRightIcon } from "lucide-react";
import { getFormatter } from "next-intl/server";

import ColoredPintIcon from "@/app/_components/icons/colored-pint";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { BreweryReview } from "@/domain/breweries/types";

interface BreweryReviewCardProps {
  review: BreweryReview;
}

const BreweryReviewCard = async ({ review }: BreweryReviewCardProps) => {
  const formatter = await getFormatter();

  return (
    <Link
      href={generatePath(Routes.REVIEW, {
        username: review.user.username,
        reviewSlug: review.slug,
      })}
      className="col-span-2 grid grid-cols-subgrid"
    >
      <div className="flex flex-row items-center gap-x-4">
        <ColoredPintIcon
          color={review.beer.color}
          size={40}
          className="size-10"
        />

        <div className="flex min-w-0 flex-col">
          <p className="font-title truncate text-lg">{review.beer.name}</p>

          <p className="text-foreground/62.5 truncate text-sm">
            {review.user.username}
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-x-4">
        <div className="flex flex-col items-end">
          <p className="font-title text-lg">{review.globalScore} / 10</p>

          <p className="text-foreground/62.5 text-sm text-nowrap">
            {formatter.relativeTime(review.createdAt)}
          </p>
        </div>

        <ChevronRightIcon className="size-6" />
      </div>
    </Link>
  );
};

export default BreweryReviewCard;
