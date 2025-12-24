"use client";

import { geoPath, type GeoPath } from "d3-geo";
import { geoWinkel3 } from "d3-geo-projection";
import { select } from "d3-selection";
import { zoom, type D3ZoomEvent } from "d3-zoom";
import countries from "i18n-iso-countries";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";

import UserWorldMapCountry from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-world-map/_components/country";
import { useWorldMapData } from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-world-map/hooks";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/_components/ui/hover-card";
import type { UserCountryStats } from "@/domain/users/types";
import { authClient } from "@/lib/auth/client";
import { useCountryCode } from "@/lib/i18n/countries/hooks";
import { cn } from "@/lib/tailwind";
import { useMediaQuery } from "@/lib/tailwind/hooks";

const MAP_WIDTH = 800;
const MAP_HEIGHT = 500;

interface UserWorldMapProps {
  username: string;
  stats: UserCountryStats[];
}

const UserWorldMap = ({ username, stats }: UserWorldMapProps) => {
  const t = useTranslations();

  const { data: session } = authClient.useSession();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { getCountry } = useCountryCode();
  const { worldData, isLoading } = useWorldMapData();

  const visitedMap = useMemo<Record<string, UserCountryStats>>(
    () =>
      stats.reduce(
        (acc, stat) => {
          const numeric = countries.alpha2ToAlpha3(stat.countryCode);
          if (numeric) {
            // Kosovo is represented as XKX in the ISO 3166-1 alpha-3 standard but
            // the library uses XKK which is the Unicode version of it.
            // https://github.com/michaelwittig/node-i18n-iso-countries/pull/365
            // We normalize to XKX to match the world map data format.
            const normalizedCode = numeric === "XKK" ? "XKX" : numeric;
            acc[normalizedCode] = stat;
          }
          return acc;
        },
        {} as Record<string, UserCountryStats>,
      ),
    [stats],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!worldData || !svgRef.current || !gRef.current) {
      return;
    }

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, isMobile ? 36 : 12])
      .translateExtent([
        [0, 0],
        [MAP_WIDTH, MAP_HEIGHT],
      ])
      .on("start", () => setTooltipOpen(false))
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        if (gRef.current) {
          gRef.current.setAttribute("transform", event.transform.toString());
        }
      });

    const svg = select(svgRef.current);
    svg.call(zoomBehavior);

    return () => {
      svg.on(".zoom", null);
    };
  }, [worldData, isMobile]);

  const pathGenerator: GeoPath = geoPath().projection(
    geoWinkel3()
      .scale(150)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]),
  );

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    name: string;
    stats?: UserCountryStats;
  } | null>(null);
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });

  const handleInteraction = (event: MouseEvent | TouchEvent, id: string) => {
    if (containerRef.current) {
      const countryStats = visitedMap[id];
      let countryName: string;
      try {
        countryName = getCountry(id).name;
      } catch {
        countryName = id;
      }

      const { clientX, clientY } =
        "touches" in event && event.touches?.[0]
          ? event.touches[0]
          : (event as MouseEvent);

      const rect = containerRef.current.getBoundingClientRect();
      setAnchorPos({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });

      setTooltipData({ name: countryName, stats: countryStats });

      setTooltipOpen(true);
    }
  };

  const handleLeave = () => {
    setTooltipOpen(false);
  };

  if (isLoading) {
    return (
      <div className="h-[20vh] w-full animate-pulse bg-neutral-200 md:h-[60vh]" />
    );
  }

  if (!worldData) {
    return <p>{t("profilePage.worldMap.failedToLoadMap")}</p>;
  }

  return (
    <div ref={containerRef} className="relative">
      <HoverCard open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <HoverCardTrigger asChild>
          <div
            className="pointer-events-none absolute size-px opacity-0"
            aria-hidden="true"
            style={{ left: anchorPos.x, top: anchorPos.y }}
          />
        </HoverCardTrigger>

        {tooltipData ? (
          <HoverCardContent
            collisionPadding={10}
            className="flex w-fit flex-col gap-y-2 overflow-hidden"
          >
            <h4 className="text-lg font-bold">{tooltipData.name}</h4>

            {tooltipData.stats ? (
              <div
                className={cn(
                  "grid grid-cols-[auto_max-content] items-center gap-x-8",
                  "*:text-xs *:font-bold",
                  "*:odd:text-foreground/62.5",
                  "*:even:place-self-end",
                )}
              >
                <span>{t("profilePage.statistics.uniqueBreweries")}</span>

                <span>{tooltipData.stats.breweries}</span>

                <span>{t("profilePage.statistics.uniqueBeers")}</span>

                <span>{tooltipData.stats.beers}</span>
              </div>
            ) : (
              <p
                className={cn(
                  "text-foreground/62.5 max-w-64",
                  "text-xs md:text-sm",
                )}
              >
                {session?.user?.username === username
                  ? t("profilePage.worldMap.yours.notVisitedCountry")
                  : t("profilePage.worldMap.others.notVisitedCountry", {
                      username,
                    })}
              </p>
            )}
          </HoverCardContent>
        ) : null}
      </HoverCard>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="h-auto w-full cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={() => setTooltipOpen(false)}
      >
        <g ref={gRef}>
          {worldData.map((feature) => (
            <UserWorldMapCountry
              key={feature.properties.a3}
              feature={feature}
              pathGenerator={pathGenerator}
              stats={visitedMap[feature.properties.a3]}
              onInteraction={handleInteraction}
              onLeave={handleLeave}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default UserWorldMap;
