"use server";

import { searchBreweries } from "@/domain/search";

export const searchAction = async (search: string) => {
  return searchBreweries({ search, limit: 10, page: 1 });
};
