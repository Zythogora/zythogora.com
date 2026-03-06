import type { Feature, GeoJsonProperties, Geometry } from "geojson";

export type MapFeature = Feature<
  Geometry,
  GeoJsonProperties & { ISO_A2: string; ISO_A3: string; ADM0_A3: string }
>;
