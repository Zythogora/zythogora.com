import { getTranslations } from "next-intl/server";
import { Fragment } from "react";

import ColoredPintIcon from "@/app/_components/icons/colored-pint";
import CountryFlag from "@/app/_components/icons/country-flag";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import DescriptionList from "@/app/_components/ui/description-list";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

import type { Color } from "@/domain/beers/types";
import type { Country } from "@/lib/i18n/countries/types";

interface BeerCardProps {
  name: string;
  brewery: {
    slug: string;
    name: string;
    country: Country;
  };
  style: string;
  abv: number;
  ibu?: number;
  color: Color;
  description?: string;
  releaseYear?: number;
  className?: string;
}

const BeerCard = async ({
  name,
  brewery,
  style,
  abv,
  ibu,
  color,
  description,
  releaseYear,
  className,
}: BeerCardProps) => {
  const t = await getTranslations();

  const hasDetails = description || releaseYear;

  return (
    <Collapsible asChild disabled={!hasDetails}>
      <CollapsibleTrigger
        className={cn(
          "relative flex flex-col gap-y-8 overflow-hidden drop-shadow",
          "border-b-2 px-10 py-12 md:rounded md:border-2 md:px-12 md:py-10",
          "bg-primary-50 dark:bg-primary-800",
          {
            "cursor-pointer": hasDetails,
          },
          className,
        )}
      >
        {hasDetails ? (
          <div className="bg-foreground absolute bottom-1.5 left-[calc(50%-theme(spacing.8))] h-1 w-16 rounded-full opacity-50" />
        ) : null}

        <div className="flex flex-col gap-y-1">
          <h1 className="text-left text-2xl md:text-4xl">{name}</h1>

          <div
            className={cn("flex flex-row items-center", "gap-x-1.5 md:gap-x-2")}
          >
            <CountryFlag
              country={brewery.country}
              size={14}
              className="size-3 md:size-3.5"
            />

            <p
              className={cn(
                "gap-x-paragraph-space flex min-w-0 flex-row text-nowrap",
                "text-sm md:text-base",
              )}
            >
              {t.rich("common.beer.brewedBy", {
                brewery: brewery.name,
                link: (chunks) => (
                  <Link
                    href={generatePath(Routes.BREWERY, {
                      brewerySlug: brewery.slug,
                    })}
                    title={brewery.name}
                    className="text-primary cursor-pointer truncate"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-5 items-center justify-between gap-x-4">
          <DescriptionList
            label={t("common.beer.style")}
            value={style}
            className={cn(
              "col-span-2",
              "*:data-[slot=description-details]:max-w-full *:data-[slot=description-details]:truncate",
            )}
            title={style}
          />

          <div className="flex items-center justify-center">
            <ColoredPintIcon color={color} size={28} className="size-7" />
          </div>

          <DescriptionList
            label={t("common.beer.abv.label")}
            value={t("common.beer.abv.value", { abv })}
            className={ibu ? "" : "col-start-5"}
          />

          {ibu ? (
            <DescriptionList label={t("common.beer.ibu")} value={ibu} />
          ) : null}
        </div>

        {hasDetails ? (
          <CollapsibleContent className="contents">
            {description ? (
              <DescriptionList
                label={t("beerPage.details.description")}
                value={(() => {
                  const lines = description.split("\n");

                  return lines.map((str, index) => (
                    <Fragment key={index}>
                      {str}

                      {index !== lines.length - 1 ? <br /> : null}
                    </Fragment>
                  ));
                })()}
              />
            ) : null}

            {releaseYear ? (
              <DescriptionList
                label={t("beerPage.details.releaseYear")}
                value={releaseYear}
                title={releaseYear?.toString()}
              />
            ) : null}
          </CollapsibleContent>
        ) : null}
      </CollapsibleTrigger>
    </Collapsible>
  );
};

export default BeerCard;
