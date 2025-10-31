import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import BarrelsIcon from "@/app/_components/icons/barrels";
import PenIcon from "@/app/_components/icons/pen";
import StyleIcon from "@/app/_components/icons/style";
import WorldIcon from "@/app/_components/icons/world";
import OpengraphPreview from "@/app/_components/opengraph-preview";
import {
  getOpengraphPreviewMetadata,
  previewImageSubTitleStyle,
  previewImageTitleStyle,
} from "@/app/_components/opengraph-preview/utils";
import { getUserByUsername } from "@/domain/users";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateImageMetadata({ params }: Props) {
  const { username } = await params;

  const user = await getUserByUsername(username).catch(() => notFound());

  return [
    getOpengraphPreviewMetadata({
      id: user.username,
      alt: user.username,
    }),
  ];
}

export default async function Image({ params }: Props) {
  const t = await getTranslations();

  const { username } = await params;

  const user = await getUserByUsername(username).catch(() => notFound());

  return OpengraphPreview({
    children: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "24px",
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
          {user.username}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "12px",
              width: "50%",
            }}
          >
            <div
              style={{
                ...previewImageSubTitleStyle,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "16px",
              }}
            >
              <PenIcon size={48} style={{ flexShrink: 0 }} />

              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t("profilePage.statistics.reviewCount", {
                  count: user.reviewCount,
                })}
              </span>
            </div>

            <div
              style={{
                ...previewImageSubTitleStyle,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "16px",
              }}
            >
              <BarrelsIcon size={48} style={{ flexShrink: 0 }} />

              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t("profilePage.metadata.uniqueBreweries", {
                  count: user.uniqueBreweryCount,
                })}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "12px",
              width: "50%",
            }}
          >
            <div
              style={{
                ...previewImageSubTitleStyle,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "16px",
              }}
            >
              <StyleIcon size={48} style={{ flexShrink: 0 }} />

              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t("profilePage.metadata.uniqueStyles", {
                  count: user.uniqueStyleCount,
                })}
              </span>
            </div>

            <div
              style={{
                ...previewImageSubTitleStyle,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: "16px",
              }}
            >
              <WorldIcon size={48} style={{ flexShrink: 0 }} />

              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {t("profilePage.metadata.uniqueCountries", {
                  count: user.uniqueCountryCount,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
  });
}
