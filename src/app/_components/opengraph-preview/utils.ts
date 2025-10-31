import type { CSSProperties } from "react";

export const previewImageTitleStyle: CSSProperties = {
  fontSize: "88px",
  lineHeight: "1.1",
  fontFamily: "KanitSemiBold",
  color: "#0C0A09", // stone-950
};

export const previewImageSubTitleStyle: CSSProperties = {
  fontSize: "56px",
  lineHeight: "1.2",
  fontFamily: "KanitRegular",
  color: "#292524", // stone-800
};

export const getOpengraphPreviewMetadata = ({
  id,
  alt,
}: {
  id: string;
  alt: string;
}) => {
  return {
    id,
    alt,
    size: {
      width: 1200,
      height: 630,
    },
    contentType: "image/png",
  };
};
