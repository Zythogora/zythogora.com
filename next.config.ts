import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/index.ts");

const nextConfig: NextConfig = withNextIntl({
  cacheComponents: true,
  cacheLife: {
    minutes: { stale: 60, revalidate: 120, expire: 3600 },
    hours: { stale: 300, revalidate: 3600, expire: 86400 },
    places: { stale: 86400, revalidate: 2592000, expire: 2592000 },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2500KB",
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "storage.ko-fi.com",
        protocol: "https",
        pathname: "/cdn/**",
      },
    ],
  },
});

export default nextConfig;
