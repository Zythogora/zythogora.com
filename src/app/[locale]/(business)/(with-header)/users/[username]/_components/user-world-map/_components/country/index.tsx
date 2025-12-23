"use client";

import type { MapFeature } from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-world-map/types";
import type { UserCountryStats } from "@/domain/users/types";
import { useCountryCode } from "@/lib/i18n/countries/hooks";
import { cn } from "@/lib/tailwind";

import type { GeoPath } from "d3-geo";
import type { MouseEvent, TouchEvent } from "react";

interface UserWorldMapCountryProps {
  feature: MapFeature;
  pathGenerator: GeoPath;
  stats?: UserCountryStats;
  onInteraction: (event: MouseEvent | TouchEvent, id: string) => void;
  onLeave: VoidFunction;
}

const UserWorldMapCountry = ({
  feature,
  pathGenerator,
  stats,
  onInteraction,
  onLeave,
}: UserWorldMapCountryProps) => {
  const { getCountry } = useCountryCode();

  let countryName: string;
  try {
    countryName = getCountry(feature.properties.a3).name;
  } catch {
    countryName = feature.properties.a3;
  }

  return (
    <path
      d={pathGenerator(feature) || ""}
      vectorEffect="non-scaling-stroke"
      tabIndex={0}
      role="button"
      aria-label={countryName}
      onClick={(e) => {
        e.stopPropagation();
        onInteraction(e, feature.properties.a3);
      }}
      onMouseMove={(e) => onInteraction(e, feature.properties.a3)}
      onMouseLeave={onLeave}
      data-visited={!!stats}
      className={cn(
        "cursor-pointer stroke-white stroke-[0.5px] transition-colors duration-300 ease-in-out outline-none",
        "focus:fill-primary/80 focus:stroke-primary-foreground",
        "data-[visited=false]:fill-neutral-200 data-[visited=false]:hover:fill-neutral-300",
        "data-[visited=true]:fill-primary data-[visited=true]:hover:fill-[color-mix(in_oklab,var(--color-primary-500),var(--color-primary-600))]",
      )}
    />
  );
};

export default UserWorldMapCountry;
