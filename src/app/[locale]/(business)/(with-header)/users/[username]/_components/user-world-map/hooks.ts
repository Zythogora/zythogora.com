"use client";

import { useState, useEffect, useCallback } from "react";
import * as topojson from "topojson-client";

import type { MapFeature } from "@/app/[locale]/(business)/(with-header)/users/[username]/_components/user-world-map/types";

import type { Topology, GeometryCollection } from "topojson-specification";

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection;
  };
}

let cachedData: MapFeature[] | null = null;
let fetchPromise: Promise<MapFeature[]> | null = null;

export const useWorldMapData = () => {
  const [data, setData] = useState<MapFeature[] | null>(cachedData);
  const [isLoading, setIsLoading] = useState(!cachedData);

  const fetchData = useCallback((promise: Promise<MapFeature[]>) => {
    promise
      .then((features) => {
        cachedData = features;
        setData(features);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        fetchPromise = null;
      });
  }, []);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setIsLoading(false);
      return;
    }

    if (fetchPromise) {
      fetchData(fetchPromise);
      return;
    }

    fetchPromise = fetch(
      "https://cdn.jsdelivr.net/npm/visionscarto-world-atlas@1/world/110m.json",
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load map data");
        }
        return res.json();
      })
      .then(
        (data: WorldAtlasTopology) =>
          topojson.feature(data, data.objects.countries)
            .features as MapFeature[],
      );

    fetchData(fetchPromise);
  }, []);

  return { worldData: data, isLoading };
};
