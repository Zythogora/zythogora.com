export const SEARCH_KINDS = ["beer", "brewery"] as const;
export type SearchKind = (typeof SEARCH_KINDS)[number];
