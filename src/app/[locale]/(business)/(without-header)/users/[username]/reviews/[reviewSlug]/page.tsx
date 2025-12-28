import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import { PurchaseType, ServingFrom } from "@db/client";

import {
  acidityValues,
  aromasIntensityValues,
  bitternessValues,
  bodyStrengthValues,
  carbonationIntensityValues,
  durationValues,
  flavorsIntensityValues,
  hazinessValues,
  headRetentionValues,
  labelDesignValues,
} from "@/app/[locale]/(business)/(without-header)/breweries/[brewerySlug]/beers/[beerSlug]/review/schemas";
import BackButton from "@/app/[locale]/(business)/(without-header)/users/[username]/reviews/[reviewSlug]/_components/back-button";
import ReviewFieldValue from "@/app/[locale]/(business)/(without-header)/users/[username]/reviews/[reviewSlug]/_components/field-value";
import ShareButton from "@/app/_components/share-button";
import DescriptionList from "@/app/_components/ui/description-list";
import { Separator } from "@/app/_components/ui/separator";
import { getReviewByUsernameAndSlug } from "@/domain/users";
import type { Review } from "@/domain/users/types";
import { publicConfig } from "@/lib/config/client-config";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/users/[username]/reviews/[reviewSlug]">): Promise<Metadata> {
  const t = await getTranslations();

  const { username, reviewSlug } = await params;

  const review = await getReviewByUsernameAndSlug(username, reviewSlug).catch(
    () => notFound(),
  );

  const title = `${review.user.username} - ${review.beer.name} | ${publicConfig.appName}`;
  const description = t("reviewPage.metadata.description", {
    username: review.user.username,
    beerName: review.beer.name,
    breweryName: review.beer.brewery.name,
    servingFrom: review.servingFrom,
    score: review.globalScore,
    reviewDate: review.createdAt,
  });

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url: `${publicConfig.baseUrl}/${generatePath(Routes.REVIEW, { username: review.user.username, reviewSlug: review.slug })}`,
      siteName: "Zythogora",
      title,
      description,
      images: review.pictureUrl
        ? review.pictureUrl.replace(".jpg", "_preview.jpg")
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "Zythogora",
      title,
      description,
      images: review.pictureUrl
        ? review.pictureUrl.replace(".jpg", "_twitter.jpg")
        : undefined,
    },
  };
}

const UserReviewPage = async ({
  params,
}: PageProps<"/[locale]/users/[username]/reviews/[reviewSlug]">) => {
  const t = await getTranslations();
  const formatter = await getFormatter();

  const { username, reviewSlug } = await params;

  const review = await getReviewByUsernameAndSlug(username, reviewSlug).catch(
    () => notFound(),
  );

  const getFormattedPurchaseLocation = (
    purchaseLocation: NonNullable<Review["purchaseLocation"]>,
  ) => {
    if (purchaseLocation.type === PurchaseType.PHYSICAL_LOCATION) {
      return purchaseLocation.additionalInformation
        ? `${purchaseLocation.description} (${purchaseLocation.additionalInformation})`
        : purchaseLocation.description;
    }

    return new URL(purchaseLocation.description).hostname;
  };

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col",
        "dark:bg-background bg-stone-100",
      )}
    >
      <div
        className={cn(
          "border-foreground w-full border-b drop-shadow",
          "bg-primary-50 dark:bg-stone-900",
        )}
      >
        <div
          className={cn(
            "mx-auto flex flex-col px-8 py-12",
            "w-full gap-y-6 md:w-3xl md:gap-y-8",
          )}
        >
          <div
            className={cn(
              "grid grid-cols-[auto_minmax(0,1fr)] items-center",
              "gap-x-6 md:gap-x-8",
            )}
          >
            <BackButton
              fallbackRoute={generatePath(Routes.PROFILE, {
                username,
              })}
              className={cn(
                "stroke-foreground stroke-[1.5]",
                "size-8 md:size-12",
              )}
            />

            <div className={cn("flex flex-col", "gap-y-1 md:gap-y-3")}>
              <Link
                href={generatePath(Routes.BEER, {
                  brewerySlug: review.beer.brewery.slug,
                  beerSlug: review.beer.slug,
                })}
                className={cn(
                  "text-primary font-title cursor-pointer",
                  "text-2xl md:text-4xl",
                )}
              >
                {review.beer.name}
              </Link>

              <p
                className={cn(
                  "gap-x-paragraph-space flex flex-row items-center text-nowrap",
                  "text-sm md:text-base",
                )}
              >
                {t.rich("common.beer.brewedBy", {
                  brewery: review.beer.brewery.name,
                  link: (chunks) => (
                    <Link
                      href={generatePath(Routes.BREWERY, {
                        brewerySlug: review.beer.brewery.slug,
                      })}
                      className="text-primary cursor-pointer truncate"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-2">
            <DescriptionList
              label={t("common.beer.style")}
              value={review.beer.style}
              className={cn(
                "col-span-2",
                "*:data-[slot=description-details]:max-w-full *:data-[slot=description-details]:truncate",
              )}
            />

            <DescriptionList
              label={t("common.beer.abv.label")}
              value={t("common.beer.abv.value", {
                abv: formatter.number(review.beer.abv),
              })}
            />

            {review.beer.ibu ? (
              <DescriptionList
                label={t("common.beer.ibu")}
                value={review.beer.ibu}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mx-auto flex flex-col gap-y-12 px-8 py-12",
          "w-full md:w-3xl",
        )}
      >
        <div
          className={cn(
            "flex flex-col",
            review.comment ? "gap-y-6" : "gap-y-4",
          )}
        >
          <div className={cn("flex flex-col", "md:gap-y-1")}>
            <p className={cn("font-title", "text-xl md:text-3xl")}>
              {t("reviewPage.overall.fields.appreciation.value", {
                score: review.globalScore,
              })}
            </p>

            <p className={cn("text-foreground/50", "text-xs md:text-base")}>
              {formatter.dateTime(review.createdAt, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>

            {review.servingFrom !== ServingFrom.UNKNOWN ? (
              <p
                className={cn(
                  "text-foreground/50 gap-x-paragraph-space flex flex-row items-center",
                  "text-xs md:text-base",
                )}
              >
                <span>
                  {t(
                    `reviewPage.overall.fields.servingFrom.possibleValues.${review.servingFrom}`,
                  )}
                </span>

                {review.bestBeforeDate ? (
                  <span>
                    (
                    {t("reviewPage.overall.fields.bestBeforeDate.value", {
                      date: formatter.dateTime(review.bestBeforeDate, {
                        dateStyle: "medium",
                        timeZone: "UTC",
                      }),
                    })}
                    )
                  </span>
                ) : null}
              </p>
            ) : null}

            {review.price || review.purchaseLocation ? (
              <p
                className={cn(
                  "text-foreground/50 gap-x-paragraph-space flex flex-row items-center",
                  "text-xs md:text-base",
                )}
              >
                {review.price && review.purchaseLocation
                  ? t.rich(
                      "reviewPage.overall.fields.purchaseInformation.priceAndLocation",
                      {
                        price: formatter.number(review.price),
                        location: getFormattedPurchaseLocation(
                          review.purchaseLocation,
                        ),
                        purchaseType: review.purchaseLocation.type,
                        link: (chunks) => (
                          <Link
                            href={review.purchaseLocation!.description}
                            className="text-primary cursor-pointer"
                          >
                            {chunks}
                          </Link>
                        ),
                      },
                    )
                  : review.purchaseLocation
                    ? t.rich(
                        "reviewPage.overall.fields.purchaseInformation.locationOnly",
                        {
                          location: getFormattedPurchaseLocation(
                            review.purchaseLocation,
                          ),
                          purchaseType: review.purchaseLocation.type,
                          link: (chunks) => (
                            <Link
                              href={review.purchaseLocation!.description}
                              className="text-primary cursor-pointer"
                            >
                              {chunks}
                            </Link>
                          ),
                        },
                      )
                    : review.price
                      ? t(
                          "reviewPage.overall.fields.purchaseInformation.priceOnly",
                          { price: formatter.number(review.price) },
                        )
                      : null}
              </p>
            ) : null}
          </div>

          {review.comment ? (
            <p className="flex flex-col gap-y-1 text-sm md:text-base">
              {(() => {
                const lines = review.comment.split("\n");

                return lines.map((str, index) => (
                  <span key={index}>{str}</span>
                ));
              })()}
            </p>
          ) : null}

          <p className="gap-x-paragraph-space flex flex-row items-center">
            {review.comment ? <span>-</span> : null}

            <Link
              href={generatePath(Routes.PROFILE, { username })}
              className={cn(
                "text-primary cursor-pointer",
                "text-sm md:text-base",
              )}
            >
              {review.user.username}
            </Link>
          </p>
        </div>

        {review.hasAppearance ||
        review.hasNose ||
        review.hasTaste ||
        review.hasFinish ? (
          <Separator className="-my-3" />
        ) : null}

        {review.hasAppearance ? (
          <div className="flex flex-col gap-y-6">
            <p className={cn("font-title", "text-xl md:text-3xl")}>
              {t("reviewPage.appearance.title")}
            </p>

            <div className="grid grid-cols-2 gap-6">
              {review.labelDesign ? (
                <DescriptionList
                  label={t("reviewPage.appearance.fields.labelDesign.label")}
                  value={
                    <ReviewFieldValue
                      label={t(
                        `reviewPage.appearance.fields.labelDesign.possibleValues.${review.labelDesign}`,
                      )}
                      value={review.labelDesign}
                      possibleValues={labelDesignValues as unknown as string[]}
                    />
                  }
                  className={cn(
                    "col-span-2",
                    "*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline",
                  )}
                />
              ) : null}

              {review.haziness ? (
                <DescriptionList
                  label={t("reviewPage.appearance.fields.haziness.label")}
                  value={
                    <ReviewFieldValue
                      label={t(
                        `reviewPage.appearance.fields.haziness.possibleValues.${review.haziness}`,
                      )}
                      value={review.haziness}
                      possibleValues={hazinessValues as unknown as string[]}
                    />
                  }
                  className="*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline"
                />
              ) : null}

              {review.headRetention ? (
                <DescriptionList
                  label={t("reviewPage.appearance.fields.headRetention.label")}
                  value={
                    <ReviewFieldValue
                      label={t(
                        `reviewPage.appearance.fields.headRetention.possibleValues.${review.headRetention}`,
                      )}
                      value={review.headRetention}
                      possibleValues={
                        headRetentionValues as unknown as string[]
                      }
                    />
                  }
                  className="*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline"
                />
              ) : null}
            </div>
          </div>
        ) : null}

        {review.hasNose ? (
          <div className="flex flex-col gap-y-6">
            <p className={cn("font-title", "text-xl md:text-3xl")}>
              {t("reviewPage.nose.title")}
            </p>

            {review.aromasIntensity ? (
              <DescriptionList
                label={t("reviewPage.nose.fields.aromasIntensity.label")}
                value={
                  <ReviewFieldValue
                    label={t(
                      `reviewPage.nose.fields.aromasIntensity.possibleValues.${review.aromasIntensity}`,
                    )}
                    value={review.aromasIntensity}
                    possibleValues={
                      aromasIntensityValues as unknown as string[]
                    }
                  />
                }
                className={cn(
                  "col-span-2",
                  "*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline",
                )}
              />
            ) : null}
          </div>
        ) : null}

        {review.hasTaste ? (
          <div className="flex flex-col gap-y-6">
            <p className={cn("font-title", "text-xl md:text-3xl")}>
              {t("reviewPage.taste.title")}
            </p>

            <div className="grid grid-cols-2 gap-6">
              {review.flavorsIntensity ? (
                <DescriptionList
                  label={t("reviewPage.taste.fields.flavorsIntensity.label")}
                  value={
                    <ReviewFieldValue
                      label={t(
                        `reviewPage.taste.fields.flavorsIntensity.possibleValues.${review.flavorsIntensity}`,
                      )}
                      value={review.flavorsIntensity}
                      possibleValues={
                        flavorsIntensityValues as unknown as string[]
                      }
                    />
                  }
                  className={cn(
                    "col-span-2",
                    "*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline",
                  )}
                />
              ) : null}

              {review.bodyStrength ? (
                <DescriptionList
                  label={t("reviewPage.taste.fields.bodyStrength.label")}
                  value={
                    <ReviewFieldValue
                      label={t(
                        `reviewPage.taste.fields.bodyStrength.possibleValues.${review.bodyStrength}`,
                      )}
                      value={review.bodyStrength}
                      possibleValues={bodyStrengthValues as unknown as string[]}
                    />
                  }
                  className="*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline"
                />
              ) : null}

              {review.carbonationIntensity ? (
                <DescriptionList
                  label={t(
                    "reviewPage.taste.fields.carbonationIntensity.label",
                  )}
                  value={
                    <ReviewFieldValue
                      label={t(
                        `reviewPage.taste.fields.carbonationIntensity.possibleValues.${review.carbonationIntensity}`,
                      )}
                      value={review.carbonationIntensity}
                      possibleValues={
                        carbonationIntensityValues as unknown as string[]
                      }
                    />
                  }
                  className="*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline"
                />
              ) : null}

              {review.bitterness ? (
                <DescriptionList
                  label={t("reviewPage.taste.fields.bitterness.label")}
                  value={
                    <ReviewFieldValue
                      label={t(
                        `reviewPage.taste.fields.bitterness.possibleValues.${review.bitterness}`,
                      )}
                      value={review.bitterness}
                      possibleValues={bitternessValues as unknown as string[]}
                    />
                  }
                  className="*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline"
                />
              ) : null}

              {review.acidity ? (
                <DescriptionList
                  label={t("reviewPage.taste.fields.acidity.label")}
                  value={
                    <ReviewFieldValue
                      label={t(
                        `reviewPage.taste.fields.acidity.possibleValues.${review.acidity}`,
                      )}
                      value={review.acidity}
                      possibleValues={acidityValues as unknown as string[]}
                    />
                  }
                  className="*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline"
                />
              ) : null}
            </div>
          </div>
        ) : null}

        {review.hasFinish ? (
          <div className="flex flex-col gap-y-6">
            <p className={cn("font-title", "text-xl md:text-3xl")}>
              {t("reviewPage.finish.title")}
            </p>

            {review.duration ? (
              <DescriptionList
                label={t("reviewPage.finish.fields.duration.label")}
                value={
                  <ReviewFieldValue
                    label={t(
                      `reviewPage.finish.fields.duration.possibleValues.${review.duration}`,
                    )}
                    value={review.duration}
                    possibleValues={durationValues as unknown as string[]}
                  />
                }
                className="*:data-[slot=description-details]:gap-x-paragraph-space *:data-[slot=description-details]:flex *:data-[slot=description-details]:flex-row *:data-[slot=description-details]:items-baseline"
              />
            ) : null}
          </div>
        ) : null}

        {review.pictureUrl ? (
          <img
            src={review.pictureUrl}
            alt={t("common.review.pictureAlt", { username })}
            className="border-foreground h-auto w-full rounded border-2 drop-shadow"
          />
        ) : null}

        <div className="isolate">
          <ShareButton
            label={t("reviewPage.actions.share")}
            link={`${publicConfig.baseUrl}${generatePath(Routes.REVIEW, {
              username,
              reviewSlug,
            })}`}
            contentClassName="w-[calc(var(--radix-popover-trigger-width)+theme(spacing.1))]"
          >
            {t("reviewPage.actions.share")}
          </ShareButton>
        </div>
      </div>
    </div>
  );
};

export default UserReviewPage;
