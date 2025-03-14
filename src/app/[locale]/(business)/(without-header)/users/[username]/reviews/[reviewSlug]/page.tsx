import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import BackButton from "@/app/[locale]/(business)/(without-header)/users/[username]/reviews/[reviewSlug]/_components/back-button";
import ShareButton from "@/app/_components/share-button";
import DescriptionList from "@/app/_components/ui/description-list";
import { Separator } from "@/app/_components/ui/separator";
import { getReviewByUsernameAndSlug } from "@/domain/users";
import { publicConfig } from "@/lib/config/client-config";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

interface UserReviewPageProps {
  params: Promise<{
    username: string;
    reviewSlug: string;
  }>;
}

export async function generateMetadata({ params }: UserReviewPageProps) {
  const t = await getTranslations();

  const { username, reviewSlug } = await params;

  const review = await getReviewByUsernameAndSlug(username, reviewSlug).catch(
    () => notFound(),
  );

  return {
    title: `${review.user.username} - ${review.beer.name} | ${publicConfig.appName}`,
    description: t("reviewPage.metadata.description", {
      username: review.user.username,
      beerName: review.beer.name,
      breweryName: review.beer.brewery.name,
      servingFrom: review.servingFrom,
      score: review.globalScore,
      reviewDate: review.createdAt,
    }),
  };
}

const UserReviewPage = async ({ params }: UserReviewPageProps) => {
  const t = await getTranslations();

  const formatter = await getFormatter();

  const { username, reviewSlug } = await params;

  const review = await getReviewByUsernameAndSlug(username, reviewSlug).catch(
    () => notFound(),
  );

  return (
    <div className={cn("flex flex-col", "dark:bg-background bg-stone-100")}>
      <div
        className={cn(
          "border-foreground w-full border-b drop-shadow",
          "bg-primary-50 dark:bg-stone-900",
        )}
      >
        <div
          className={cn(
            "mx-auto flex flex-col px-8 py-12",
            "w-full gap-y-6 md:w-192 md:gap-y-8",
          )}
        >
          <div
            className={cn(
              "grid grid-cols-[max-content_auto] items-center",
              "gap-x-6 md:gap-x-8",
            )}
          >
            <BackButton
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
                  "gap-x-paragraph-space flex flex-row items-center",
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
                      className="text-primary cursor-pointer"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4">
            <DescriptionList
              label={t("common.beer.style")}
              value={review.beer.style}
              className="col-span-2"
            />

            <DescriptionList
              label={t("common.beer.abv.label")}
              value={t("common.beer.abv.value", { abv: review.beer.abv })}
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
          "w-full md:w-192",
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
                  value={t(
                    `reviewPage.appearance.fields.labelDesign.possibleValues.${review.labelDesign}`,
                  )}
                  className="col-span-2"
                />
              ) : null}

              {review.haziness ? (
                <DescriptionList
                  label={t("reviewPage.appearance.fields.haziness.label")}
                  value={t(
                    `reviewPage.appearance.fields.haziness.possibleValues.${review.haziness}`,
                  )}
                />
              ) : null}

              {review.headRetention ? (
                <DescriptionList
                  label={t("reviewPage.appearance.fields.headRetention.label")}
                  value={t(
                    `reviewPage.appearance.fields.headRetention.possibleValues.${review.headRetention}`,
                  )}
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
                value={t(
                  `reviewPage.nose.fields.aromasIntensity.possibleValues.${review.aromasIntensity}`,
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
                  value={t(
                    `reviewPage.taste.fields.flavorsIntensity.possibleValues.${review.flavorsIntensity}`,
                  )}
                  className="col-span-2"
                />
              ) : null}

              {review.bodyStrength ? (
                <DescriptionList
                  label={t("reviewPage.taste.fields.bodyStrength.label")}
                  value={t(
                    `reviewPage.taste.fields.bodyStrength.possibleValues.${review.bodyStrength}`,
                  )}
                />
              ) : null}

              {review.carbonationIntensity ? (
                <DescriptionList
                  label={t(
                    "reviewPage.taste.fields.carbonationIntensity.label",
                  )}
                  value={t(
                    `reviewPage.taste.fields.carbonationIntensity.possibleValues.${review.carbonationIntensity}`,
                  )}
                />
              ) : null}

              {review.bitterness ? (
                <DescriptionList
                  label={t("reviewPage.taste.fields.bitterness.label")}
                  value={t(
                    `reviewPage.taste.fields.bitterness.possibleValues.${review.bitterness}`,
                  )}
                />
              ) : null}

              {review.acidity ? (
                <DescriptionList
                  label={t("reviewPage.taste.fields.acidity.label")}
                  value={t(
                    `reviewPage.taste.fields.acidity.possibleValues.${review.acidity}`,
                  )}
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
                value={t(
                  `reviewPage.finish.fields.duration.possibleValues.${review.duration}`,
                )}
              />
            ) : null}
          </div>
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
