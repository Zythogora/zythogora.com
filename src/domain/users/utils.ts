import type { Reviews } from "@prisma/client";

const appearanceColumns: (keyof Reviews)[] = [
  "labelDesign",
  "haziness",
  "headRetention",
];

const noseColumns: (keyof Reviews)[] = ["aromasIntensity"];

const tasteColumns: (keyof Reviews)[] = [
  "flavorsIntensity",
  "bodyStrength",
  "carbonationIntensity",
  "bitterness",
  "acidity",
];

const finishColumns: (keyof Reviews)[] = ["duration"];

export const reviewHasAppearance = (review: Reviews) => {
  return appearanceColumns.some((key) => review[key]);
};

export const reviewHasNose = (review: Reviews) => {
  return noseColumns.some((key) => review[key]);
};

export const reviewHasTaste = (review: Reviews) => {
  return tasteColumns.some((key) => review[key]);
};

export const reviewHasFinish = (review: Reviews) => {
  return finishColumns.some((key) => review[key]);
};
