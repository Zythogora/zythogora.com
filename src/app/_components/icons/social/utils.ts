import type { SupportedSocialIcons } from "@/app/_components/icons/social/types";

export const getSocialIconType = (
  url: string,
): SupportedSocialIcons | undefined => {
  if (url.includes("instagram.com")) {
    return "INSTAGRAM";
  }

  if (url.includes("facebook.com")) {
    return "FACEBOOK";
  }

  if (url.includes("youtube.com")) {
    return "YOUTUBE";
  }

  if (url.includes("tiktok.com")) {
    return "TIKTOK";
  }

  if (url.includes("bsky.app")) {
    return "BLUESKY";
  }

  if (url.includes("discord.gg")) {
    return "DISCORD";
  }

  if (url.includes("x.com") || url.includes("twitter.com")) {
    return "X";
  }

  return undefined;
};
