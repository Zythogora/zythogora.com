"server only";

import { PlacesClient } from "@googlemaps/places";

import { config } from "@/lib/config";

export const placesClient =
  config.nodeEnv === "development"
    ? // Authenticated through the CLI
      new PlacesClient()
    : new PlacesClient({
        projectId: config.gcp.projectId,
        credentials: {
          client_email: config.gcp.serviceAccount.email,
          private_key: config.gcp.serviceAccount.privateKey,
        },
      });
