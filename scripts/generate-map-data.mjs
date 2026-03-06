import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const GEOJSON_URL =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/cultural/ne_50m_admin_0_map_units.json";

const OUTPUT_PATH = join(
  import.meta.dirname,
  "..",
  "public",
  "data",
  "world-50m-map-units.json",
);

async function main() {
  console.log("Downloading Natural Earth 50m map units GeoJSON...");
  const response = await fetch(GEOJSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }

  const geojson = await response.json();
  console.log(`Downloaded ${geojson.features.length} features`);

  // Keep only the properties we need
  for (const feature of geojson.features) {
    const { ISO_A2, ISO_A3, ADM0_A3 } = feature.properties;
    feature.properties = { ISO_A2, ISO_A3, ADM0_A3 };
  }

  console.log("Converting to TopoJSON...");
  const { topology } = await import("topojson-server");
  const { quantize } = await import("topojson-client");

  const topo = topology({ map_units: geojson });
  const quantized = quantize(topo, 1e5);

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(quantized));

  const sizeKB = (JSON.stringify(quantized).length / 1024).toFixed(1);
  console.log(`Written to ${OUTPUT_PATH} (${sizeKB} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
