"server only";

import { transformRawColorToColor } from "@/domain/beers/transforms";
import type { CellarItem, RawCellarItem } from "@/domain/cellar/types";
import { getCountry } from "@/lib/i18n/countries";

export const transformRawCellarItemToCellarItem = async (
  rawItem: RawCellarItem,
): Promise<CellarItem> => ({
  id: rawItem.id,
  quantity: rawItem.quantity,
  servingFormat: rawItem.servingFormat,
  bestBeforeDate: rawItem.bestBeforeDate,
  purchaseDate: rawItem.purchaseDate,
  purchasePrice: rawItem.purchasePrice
    ? Number(rawItem.purchasePrice)
    : null,
  purchaseCurrency: rawItem.purchaseCurrency,
  beer: {
    id: rawItem.beer.id,
    slug: rawItem.beer.slug,
    name: rawItem.beer.name,
    brewery: {
      id: rawItem.beer.brewery.id,
      slug: rawItem.beer.brewery.slug,
      name: rawItem.beer.brewery.name,
      country: await getCountry(rawItem.beer.brewery.countryAlpha2Code),
    },
    color: transformRawColorToColor(rawItem.beer.color),
  },
  storageLocation: rawItem.storageLocation
    ? {
        id: rawItem.storageLocation.id,
        name: rawItem.storageLocation.name,
      }
    : null,
  purchaseLocation: rawItem.purchaseLocation
    ? {
        id: rawItem.purchaseLocation.id,
        description: rawItem.purchaseLocation.description,
        additionalInformation:
          rawItem.purchaseLocation.additionalInformation,
      }
    : null,
  createdAt: rawItem.createdAt,
  updatedAt: rawItem.updatedAt,
});
