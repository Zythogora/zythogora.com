import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import OpengraphPreview from "@/app/_components/opengraph-preview";
import {
  getOpengraphPreviewMetadata,
  previewImageSubTitleStyle,
  previewImageTitleStyle,
} from "@/app/_components/opengraph-preview/utils";
import { getBreweryBySlug } from "@/domain/breweries";

export async function generateImageMetadata({
  params,
}: PageProps<"/[locale]/breweries/[brewerySlug]">) {
  const { brewerySlug } = await params;

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => null);

  if (!brewery) {
    return [];
  }

  return [
    getOpengraphPreviewMetadata({
      id: brewery.slug,
      alt: brewery.name,
    }),
  ];
}

export default async function Image({
  params,
}: PageProps<"/[locale]/breweries/[brewerySlug]">) {
  const t = await getTranslations();

  const { brewerySlug } = await params;

  const brewery = await getBreweryBySlug(brewerySlug).catch(() => notFound());

  return OpengraphPreview({
    children: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            ...previewImageTitleStyle,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {brewery.name}
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
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              columnGap: "24px",
            }}
          >
            <img
              src={`https://hatscripts.github.io/circle-flags/flags/${brewery.location.country.code.toLowerCase()}.svg`}
              alt={brewery.location.country.name}
              width={56}
              height={56}
              style={{
                borderRadius: "50%",
                border: "2px solid #292524",
              }}
            />

            <span>{brewery.location.country.name}</span>
          </span>

          <span>•</span>

          <span>
            {t("breweryPage.tabs.beers.content.count", {
              count: brewery.beers.length,
            })}
          </span>
        </p>
      </div>
    ),
  });
}
