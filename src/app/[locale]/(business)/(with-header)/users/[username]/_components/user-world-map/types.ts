import type { Feature, GeoJsonProperties, Geometry } from "geojson";

export type MapFeature = Feature<Geometry, GeoJsonProperties & { a3: string }>;
