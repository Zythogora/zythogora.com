import { getTranslationsByLocale } from "@/lib/i18n";

import type { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslationsByLocale("en");

  return {
    name: t("metadata.title"),
    short_name: t("metadata.title"),
    description: t("metadata.description"),
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF9",
    theme_color: "#FFAA00",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
