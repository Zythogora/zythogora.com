"server only";

import sharp from "sharp";

import { visionClient } from "@/lib/images/gcp";
import type { Preview } from "@/lib/images/types";

interface OptimizeImageOptions {
  maxDimension?: number;
  quality?: number;
}

export const optimizeImage = async (
  imageBuffer: Buffer,
  options: OptimizeImageOptions = {},
) => {
  const { maxDimension = 1200, quality = 80 } = options;

  return sharp(imageBuffer)
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
};

export const checkImageForExplicitContent = async (imageBuffer: Buffer) => {
  const [{ safeSearchAnnotation }] = await visionClient.safeSearchDetection({
    image: { content: imageBuffer },
  });

  const isExplicit =
    !safeSearchAnnotation ||
    safeSearchAnnotation.adult === "LIKELY" ||
    safeSearchAnnotation.adult === "VERY_LIKELY" ||
    safeSearchAnnotation.racy === "LIKELY" ||
    safeSearchAnnotation.racy === "VERY_LIKELY" ||
    safeSearchAnnotation.violence === "LIKELY" ||
    safeSearchAnnotation.violence === "VERY_LIKELY";

  return { isExplicit, detections: safeSearchAnnotation };
};

export const createPreviews = async (
  imageBuffer: Buffer,
): Promise<Array<Preview>> => {
  const sharpInstance = sharp(imageBuffer);

  const [previewImage, twitterImage] = await Promise.all([
    sharpInstance.resize({ width: 1200, height: 630 }).toBuffer(),
    sharpInstance.resize({ width: 1200, height: 675 }).toBuffer(),
  ]);

  return [
    { name: "preview", image: previewImage },
    { name: "twitter", image: twitterImage },
  ];
};
