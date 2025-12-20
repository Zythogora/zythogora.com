import { getTranslations } from "next-intl/server";

import OpengraphPreview from "@/app/_components/opengraph-preview";
import {
  getOpengraphPreviewMetadata,
  previewImageSubTitleStyle,
  previewImageTitleStyle,
} from "@/app/_components/opengraph-preview/utils";
import { publicConfig } from "@/lib/config/client-config";

export async function generateImageMetadata() {
  return [
    getOpengraphPreviewMetadata({
      id: "default",
      alt: publicConfig.appName,
    }),
  ];
}

export default async function Image() {
  const t = await getTranslations();

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
          {publicConfig.appName}
        </p>

        <p
          style={{
            ...previewImageSubTitleStyle,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {t("metadata.description")}
        </p>
      </div>
    ),
  });
}
