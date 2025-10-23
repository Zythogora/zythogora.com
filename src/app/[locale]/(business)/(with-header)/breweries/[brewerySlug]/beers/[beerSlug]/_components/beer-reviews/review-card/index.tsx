import { ChevronRightIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import ServingFromBottleIcon from "@/app/_components/icons/serving-from/bottle";
import ServingFromCanIcon from "@/app/_components/icons/serving-from/can";
import ServingFromCaskIcon from "@/app/_components/icons/serving-from/cask";
import ServingFromDraftIcon from "@/app/_components/icons/serving-from/draft";
import ServingFromGrowlerIcon from "@/app/_components/icons/serving-from/growler";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { BeerReview } from "@/domain/beers/types";

interface BeerReviewCardProps {
  review: BeerReview;
}

const BeerReviewCard = async ({ review }: BeerReviewCardProps) => {
  const t = await getTranslations();
  const formatter = await getFormatter();

  return (
    <Link
      href={generatePath(Routes.REVIEW, {
        username: review.username,
        reviewSlug: review.slug,
      })}
      className="col-span-2 grid grid-cols-subgrid"
    >
      <div className="flex flex-row items-center gap-x-4">
        {
          {
            DRAFT: (
              <ServingFromDraftIcon
                size={40}
                className="fill-foreground size-10"
              />
            ),
            BOTTLE: (
              <ServingFromBottleIcon
                size={40}
                className="fill-foreground size-10"
              />
            ),
            CAN: (
              <ServingFromCanIcon
                size={40}
                className="fill-foreground size-10"
              />
            ),
            GROWLER: (
              <ServingFromGrowlerIcon
                size={40}
                className="fill-foreground size-10"
              />
            ),
            CASK: (
              <ServingFromCaskIcon
                size={40}
                className="fill-foreground size-10"
              />
            ),
            UNKNOWN: null,
          }[review.servingFrom]
        }

        <div className="flex min-w-0 flex-col">
          <p className="font-title truncate text-lg">{review.username}</p>

          {review.servingFrom !== "UNKNOWN" ? (
            <p className="text-foreground/62.5 truncate text-sm">
              {t(`beerPage.result.servingFrom.${review.servingFrom}`)}
            </p>
          ) : null}
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

export default BeerReviewCard;
