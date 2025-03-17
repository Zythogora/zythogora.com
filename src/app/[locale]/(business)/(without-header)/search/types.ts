export const SEARCH_KINDS = ["beer", "brewery", "user"] as const;
export type SearchKind = (typeof SEARCH_KINDS)[number];
