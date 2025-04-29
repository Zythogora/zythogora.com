"server only";

import vision from "@google-cloud/vision";

import { config } from "@/lib/config";

export const visionClient =
  config.nodeEnv === "development"
    ? // Authenticated through the CLI
      new vision.ImageAnnotatorClient()
    : new vision.ImageAnnotatorClient({
        projectId: config.gcp.projectId,
        credentials: {
          client_email: config.gcp.serviceAccount.email,
          private_key: config.gcp.serviceAccount.privateKey,
        },
      });
