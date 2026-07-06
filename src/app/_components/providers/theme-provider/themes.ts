export const availableThemes = ["light", "dark"] as const;

export type Theme = (typeof availableThemes)[number] | "system";
