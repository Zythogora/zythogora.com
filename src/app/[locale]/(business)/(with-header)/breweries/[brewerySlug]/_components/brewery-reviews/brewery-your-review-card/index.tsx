import { ChevronRightIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import ColoredPintIcon from "@/app/_components/icons/colored-pint";
import Chip from "@/app/_components/ui/chip";
import type { BreweryReview } from "@/domain/breweries/types";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

interface BreweryYourReviewCardProps {
  review: BreweryReview;
}

const BreweryYourReviewCard = async ({
  review,
}: BreweryYourReviewCardProps) => {
  const t = await getTranslations();
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

          <div className="flex min-w-0 grow-0 flex-row gap-x-1.5">
            <Chip className="truncate">{review.beer.style}</Chip>

            <Chip className="w-fit text-nowrap">
              {t("common.beer.abv.value", {
                abv: formatter.number(review.beer.abv),
              })}
            </Chip>

            {review.beer.ibu ? (
              <Chip className="w-fit text-nowrap">{review.beer.ibu} IBU</Chip>
            ) : null}
          </div>
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

export default BreweryYourReviewCard;
