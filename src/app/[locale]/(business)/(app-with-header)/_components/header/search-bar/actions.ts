"use server";

import { searchBeers, searchBreweries } from "@/domain/search";

import type { SearchKind } from "@/app/[locale]/(business)/(search)/search/types";
import type { PaginatedResults } from "@/lib/pagination/types";

export const searchAction = async (search: string) => {
  const [beer, brewery] = await Promise.all([
    searchBeers({ search, limit: 3, page: 1 }),
    searchBreweries({ search, limit: 3, page: 1 }),
  ]);

  return { beer, brewery } satisfies Record<
    SearchKind,
    PaginatedResults<unknown>
  >;
};
