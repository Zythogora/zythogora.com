import LinkIcon from "@/app/_components/icons/link";
import type { SupportedSocialIcons } from "@/app/_components/icons/social/types";
import BlueskyIcon from "@/app/_components/icons/social/types/bluesky";
import DiscordIcon from "@/app/_components/icons/social/types/discord";
import FacebookIcon from "@/app/_components/icons/social/types/facebook";
import InstagramIcon from "@/app/_components/icons/social/types/instagram";
import TikTokIcon from "@/app/_components/icons/social/types/tiktok";
import XIcon from "@/app/_components/icons/social/types/x";
import YouTubeIcon from "@/app/_components/icons/social/types/youtube";
import type { IconProps } from "@/app/_components/icons/types";
import { exhaustiveCheck } from "@/lib/typescript/utils";

interface SocialIconProps extends IconProps {
  type?: SupportedSocialIcons;
}

const SocialIcon = ({ type, ...restProps }: SocialIconProps) => {
  if (!type) {
    return <LinkIcon {...restProps} />;
  }

  switch (type) {
    case "INSTAGRAM":
      return <InstagramIcon {...restProps} />;

    case "FACEBOOK":
      return <FacebookIcon {...restProps} />;

    case "YOUTUBE":
      return <YouTubeIcon {...restProps} />;

    case "TIKTOK":
      return <TikTokIcon {...restProps} />;

    case "BLUESKY":
      return <BlueskyIcon {...restProps} />;

    case "DISCORD":
      return <DiscordIcon {...restProps} />;

    case "X":
      return <XIcon {...restProps} />;

    default:
      exhaustiveCheck({ value: type, error: "Invalid social icon type" });
  }
};

export default SocialIcon;
