import { ImageResponse } from "next/og";

import { publicConfig } from "@/lib/config/client-config";

import type { ImageResponseOptions } from "next/server";
import type { ReactNode } from "react";

interface OpengraphPreviewProps {
  children: ReactNode;
  options?: ImageResponseOptions;
  waveColor?: string;
}

const OpengraphPreview = async ({
  children,
  options,
  waveColor = "#FFAA00", // brand-500
}: OpengraphPreviewProps) => {
  const [kanitRegular, kanitSemiBold] = await Promise.all([
    await fetch(
      new URL(`${publicConfig.baseUrl}/fonts/Kanit-Regular.ttf`),
    ).then((res) => res.arrayBuffer()),
    await fetch(
      new URL(`${publicConfig.baseUrl}/fonts/Kanit-SemiBold.ttf`),
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#F5F5F4", // stone-50
          paddingTop: "12px",
          paddingBottom: "140px",
          paddingLeft: "72px",
          paddingRight: "72px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "12px",
            backgroundColor: "#FFAA00", // brand-500
          }}
        />

        {children}

        <svg
          width="1200"
          height="200"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
        >
          <path
            d="M0,60 Q300,100 600,60 Q900,20 1200,60 L1200,200 L0,200 Z"
            fill={waveColor}
          />
        </svg>
      </div>
    ),
    {
      fonts: [
        {
          name: "KanitRegular",
          data: kanitRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "KanitSemiBold",
          data: kanitSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
      ...options,
    },
  );
};

export default OpengraphPreview;
