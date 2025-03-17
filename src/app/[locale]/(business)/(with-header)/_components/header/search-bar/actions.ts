"use server";

import { searchBeers, searchBreweries, searchUsers } from "@/domain/search";

import type { SearchKind } from "@/app/[locale]/(business)/(without-header)/search/types";
import type { PaginatedResults } from "@/lib/pagination/types";

export const searchAction = async (search: string) => {
  const [beer, brewery, user] = await Promise.all([
    searchBeers({ search, limit: 3, page: 1 }),
    searchBreweries({ search, limit: 3, page: 1 }),
    searchUsers({ search, limit: 3, page: 1 }),
  ]);

  return { beer, brewery, user } satisfies Record<
    SearchKind,
    PaginatedResults<unknown>
  >;
};
