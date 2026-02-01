import type {
  Beers,
  Breweries,
  CellarItems,
  Colors,
  PurchaseLocations,
  ServingFrom,
  StorageLocations,
} from "@db/client";

import type { Color } from "@/domain/beers/types";
import type { Country } from "@/lib/i18n/countries/types";

export type RawCellarItem = CellarItems & {
  beer: Beers & {
    brewery: Breweries;
    color: Colors;
  };
  storageLocation: StorageLocations | null;
  purchaseLocation: PurchaseLocations | null;
};

export type CellarItem = {
  id: string;
  quantity: number;
  servingFormat: ServingFrom;
  bestBeforeDate: Date | null;
  purchaseDate: Date | null;
  purchasePrice: number | null;
  purchaseCurrency: string | null;
  beer: {
    id: string;
    slug: string;
    name: string;
    brewery: {
      id: string;
      slug: string;
      name: string;
      country: Country;
    };
    color: Color;
  };
  storageLocation: {
    id: string;
    name: string;
  } | null;
  purchaseLocation: {
    id: string;
    description: string;
    additionalInformation: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CellarStats = {
  totalItems: number;
  totalQuantity: number;
  uniqueBeers: number;
  expiringWithin30Days: number;
  totalValue: number | null;
};

export type ExpirationStatus = {
  status: "expired" | "critical" | "warning" | "good" | "unknown";
  daysRemaining: number | null;
};

export type CreateCellarItemData = {
  beerId: string;
  quantity: number;
  servingFormat: ServingFrom;
  bestBeforeDate?: Date;
  purchaseDate?: Date;
  purchasePrice?: number;
  purchaseCurrency?: string;
  storageLocationId?: string;
  storageLocationName?: string;
  purchaseLocationId?: string;
};
