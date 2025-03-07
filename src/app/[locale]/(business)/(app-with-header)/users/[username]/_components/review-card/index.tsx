import { getFormatter } from "next-intl/server";

import ColoredPintIcon from "@/app/_components/icons/colored-pint";
import CountryFlag from "@/app/_components/icons/country-flag";

import type { Review } from "@/domain/users/types";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = async ({ review }: ReviewCardProps) => {
  const format = await getFormatter();

  return (
    <div className="col-span-2 grid grid-cols-subgrid">
      <div className="flex flex-row items-center gap-x-4">
        <ColoredPintIcon
          color={review.beer.color}
          size={40}
          className="size-10"
        />

        <div className="flex min-w-0 flex-col">
          <p className="font-title truncate text-lg">{review.beer.name}</p>

          <div className="flex flex-row items-center gap-x-1">
            <CountryFlag
              country={review.beer.brewery.country}
              size={14}
              className="size-3.5"
            />

            <p className="text-foreground/62.5 truncate text-sm">
              {review.beer.brewery.name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-title text-lg">{review.globalScore} / 10</p>

        <p className="text-foreground/45 text-sm text-nowrap">
          {format.relativeTime(review.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
