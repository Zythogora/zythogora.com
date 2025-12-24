import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import OpengraphPreview from "@/app/_components/opengraph-preview";
import {
  getOpengraphPreviewMetadata,
  previewImageSubTitleStyle,
  previewImageTitleStyle,
} from "@/app/_components/opengraph-preview/utils";
import { getBeerBySlug } from "@/domain/beers";

export async function generateImageMetadata({
  params,
}: PageProps<"/[locale]/breweries/[brewerySlug]/beers/[beerSlug]">) {
  const { brewerySlug, beerSlug } = await params;

  const beer = await getBeerBySlug(beerSlug, brewerySlug).catch(() => null);

  if (!beer) {
    return [];
  }

  return [
    getOpengraphPreviewMetadata({
      id: beer.slug,
      alt: beer.name,
    }),
  ];
}

export default async function Image({
  params,
}: PageProps<"/[locale]/breweries/[brewerySlug]/beers/[beerSlug]">) {
  const t = await getTranslations();
  const formatter = await getFormatter();

  const { brewerySlug, beerSlug } = await params;

  const beer = await getBeerBySlug(beerSlug, brewerySlug).catch(() =>
    notFound(),
  );

  return OpengraphPreview({
    children: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "-8px",
        }}
      >
        <p
          style={{
            ...previewImageTitleStyle,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {beer.name}
        </p>

        <p
          style={{
            ...previewImageSubTitleStyle,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: "24px",
          }}
        >
          <img
            src={`https://hatscripts.github.io/circle-flags/flags/${beer.brewery.country.code.toLowerCase()}.svg`}
            alt={beer.brewery.country.name}
            width={56}
            height={56}
            style={{
              borderRadius: "50%",
              border: "2px solid #292524",
            }}
          />

          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {beer.brewery.name}
          </span>
        </p>

        <p
          style={{
            ...previewImageSubTitleStyle,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: "32px",
          }}
        >
          <span
            style={{
              flexShrink: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {beer.style}
          </span>

          <span>•</span>

          <span>
            {t("common.beer.abv.value", { abv: formatter.number(beer.abv) })}
          </span>

          {beer.ibu ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "32px",
              }}
            >
              <span>•</span>

              <span>{beer.ibu} IBU</span>
            </div>
          ) : null}
        </p>
      </div>
    ),
    waveColor: `#${beer.color.hex}`,
  });
}
