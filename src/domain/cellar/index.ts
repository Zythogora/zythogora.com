"server only";

import { nanoid } from "nanoid";
import { cache } from "react";

import type { Prisma, ServingFrom } from "@db/client";

import {
  InvalidQuantityError,
  UnauthorizedCellarError,
  UnknownBeerError,
  UnknownCellarItemError,
} from "@/domain/cellar/errors";
import { transformRawCellarItemToCellarItem } from "@/domain/cellar/transforms";
import type {
  CellarItem,
  CellarStats,
  CreateCellarItemData,
  ExpirationStatus,
} from "@/domain/cellar/types";
import { getOrCreateStorageLocation } from "@/domain/storage-locations";
import { getCurrentUser } from "@/lib/auth";
import { getPaginatedResults } from "@/lib/pagination";
import type {
  PaginatedResults,
  PaginationParams,
} from "@/lib/pagination/types";
import prisma, { getPrismaTransactionClient } from "@/lib/prisma";

const cellarItemInclude = {
  beer: {
    include: {
      brewery: true,
      color: true,
    },
  },
  storageLocation: true,
  purchaseLocation: true,
} satisfies Prisma.CellarItemsInclude;

export const getCellarItemsByUser = cache(
  async ({
    userId,
    limit = 20,
    page = 1,
    storageLocationId,
    servingFormat,
    expiringWithinDays,
  }: PaginationParams<{
    userId: string;
    storageLocationId?: string;
    servingFormat?: ServingFrom;
    expiringWithinDays?: number;
  }>): Promise<PaginatedResults<CellarItem>> => {
    const where: Prisma.CellarItemsWhereInput = {
      userId,
      ...(storageLocationId && { storageLocationId }),
      ...(servingFormat && { servingFormat }),
      ...(expiringWithinDays && {
        bestBeforeDate: {
          lte: new Date(
            Date.now() + expiringWithinDays * 24 * 60 * 60 * 1000,
          ),
          gte: new Date(),
        },
      }),
    };

    const [rawItems, itemCount] = await getPrismaTransactionClient()((tx) =>
      Promise.all([
        tx.cellarItems.findMany({
          where,
          include: cellarItemInclude,
          orderBy: [
            { bestBeforeDate: { sort: "asc", nulls: "last" } },
            { createdAt: "desc" },
          ],
          take: limit,
          skip: (page - 1) * limit,
        }),
        tx.cellarItems.count({ where }),
      ]),
    );

    const items = rawItems.map(transformRawCellarItemToCellarItem);

    return getPaginatedResults(items, itemCount, page, limit);
  },
);

export const getCellarItemById = cache(
  async (itemId: string): Promise<CellarItem> => {
    const item = await prisma.cellarItems.findUnique({
      where: { id: itemId },
      include: cellarItemInclude,
    });

    if (!item) {
      throw new UnknownCellarItemError();
    }

    return transformRawCellarItemToCellarItem(item);
  },
);

export const getCellarStats = cache(
  async (userId: string): Promise<CellarStats> => {
    const thirtyDaysFromNow = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    const [items, uniqueBeers, expiringItems] = await Promise.all([
      prisma.cellarItems.findMany({
        where: { userId },
        select: {
          quantity: true,
          purchasePrice: true,
          purchaseCurrency: true,
        },
      }),
      prisma.cellarItems.groupBy({
        by: ["beerId"],
        where: { userId },
        _count: true,
      }),
      prisma.cellarItems.count({
        where: {
          userId,
          bestBeforeDate: {
            lte: thirtyDaysFromNow,
            gte: new Date(),
          },
        },
      }),
    ]);

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate total value (only for items with price)
    const itemsWithPrice = items.filter(
      (item) => item.purchasePrice !== null,
    );
    const totalValue =
      itemsWithPrice.length > 0
        ? itemsWithPrice.reduce(
            (sum, item) =>
              sum + Number(item.purchasePrice) * item.quantity,
            0,
          )
        : null;

    return {
      totalItems: items.length,
      totalQuantity,
      uniqueBeers: uniqueBeers.length,
      expiringWithin30Days: expiringItems,
      totalValue,
    };
  },
);

export const addToCellar = async (
  data: CreateCellarItemData,
): Promise<CellarItem> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedCellarError();
  }

  const beer = await prisma.beers.findUnique({
    where: { id: data.beerId },
  });

  if (!beer) {
    throw new UnknownBeerError();
  }

  // Handle storage location (create if name provided)
  let storageLocationId = data.storageLocationId;
  if (!storageLocationId && data.storageLocationName) {
    const storageLocation = await getOrCreateStorageLocation(
      data.storageLocationName,
    );
    storageLocationId = storageLocation.id;
  }

  const item = await prisma.cellarItems.create({
    data: {
      id: nanoid(),
      beerId: data.beerId,
      userId: user.id,
      quantity: data.quantity,
      servingFormat: data.servingFormat,
      bestBeforeDate: data.bestBeforeDate,
      purchaseDate: data.purchaseDate,
      purchasePrice: data.purchasePrice,
      purchaseCurrency: data.purchaseCurrency,
      storageLocationId,
      purchaseLocationId: data.purchaseLocationId,
    },
    include: cellarItemInclude,
  });

  return transformRawCellarItemToCellarItem(item);
};

export const updateCellarItem = async (
  itemId: string,
  data: Partial<CreateCellarItemData>,
): Promise<CellarItem> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedCellarError();
  }

  const item = await prisma.cellarItems.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new UnknownCellarItemError();
  }

  if (item.userId !== user.id) {
    throw new UnauthorizedCellarError();
  }

  // Handle storage location (create if name provided)
  let storageLocationId = data.storageLocationId;
  if (data.storageLocationName) {
    const storageLocation = await getOrCreateStorageLocation(
      data.storageLocationName,
    );
    storageLocationId = storageLocation.id;
  }

  const updatedItem = await prisma.cellarItems.update({
    where: { id: itemId },
    data: {
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.servingFormat && { servingFormat: data.servingFormat }),
      ...(data.bestBeforeDate !== undefined && {
        bestBeforeDate: data.bestBeforeDate,
      }),
      ...(data.purchaseDate !== undefined && {
        purchaseDate: data.purchaseDate,
      }),
      ...(data.purchasePrice !== undefined && {
        purchasePrice: data.purchasePrice,
      }),
      ...(data.purchaseCurrency !== undefined && {
        purchaseCurrency: data.purchaseCurrency,
      }),
      ...(storageLocationId !== undefined && { storageLocationId }),
      ...(data.purchaseLocationId !== undefined && {
        purchaseLocationId: data.purchaseLocationId,
      }),
    },
    include: cellarItemInclude,
  });

  return transformRawCellarItemToCellarItem(updatedItem);
};

export const adjustCellarItemQuantity = async (
  itemId: string,
  delta: number,
): Promise<CellarItem | null> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedCellarError();
  }

  const item = await prisma.cellarItems.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new UnknownCellarItemError();
  }

  if (item.userId !== user.id) {
    throw new UnauthorizedCellarError();
  }

  const newQuantity = item.quantity + delta;

  if (newQuantity <= 0) {
    await prisma.cellarItems.delete({ where: { id: itemId } });
    return null;
  }

  const updatedItem = await prisma.cellarItems.update({
    where: { id: itemId },
    data: { quantity: newQuantity },
    include: cellarItemInclude,
  });

  return transformRawCellarItemToCellarItem(updatedItem);
};

export const moveCellarItem = async (
  itemId: string,
  storageLocationId: string | null,
): Promise<CellarItem> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedCellarError();
  }

  const item = await prisma.cellarItems.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new UnknownCellarItemError();
  }

  if (item.userId !== user.id) {
    throw new UnauthorizedCellarError();
  }

  // Verify the storage location belongs to the user (if provided)
  if (storageLocationId) {
    const storageLocation = await prisma.storageLocations.findUnique({
      where: { id: storageLocationId },
    });

    if (!storageLocation || storageLocation.userId !== user.id) {
      throw new UnauthorizedCellarError();
    }
  }

  const updatedItem = await prisma.cellarItems.update({
    where: { id: itemId },
    data: { storageLocationId },
    include: cellarItemInclude,
  });

  return transformRawCellarItemToCellarItem(updatedItem);
};

export const deleteCellarItem = async (itemId: string): Promise<void> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedCellarError();
  }

  const item = await prisma.cellarItems.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new UnknownCellarItemError();
  }

  if (item.userId !== user.id) {
    throw new UnauthorizedCellarError();
  }

  await prisma.cellarItems.delete({ where: { id: itemId } });
};

export const getCurrentUserCellarItems = async ({
  limit = 20,
  page = 1,
  storageLocationId,
  servingFormat,
  expiringWithinDays,
}: PaginationParams<{
  storageLocationId?: string;
  servingFormat?: ServingFrom;
  expiringWithinDays?: number;
}> = {}): Promise<PaginatedResults<CellarItem>> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedCellarError();
  }

  return getCellarItemsByUser({
    userId: user.id,
    limit,
    page,
    storageLocationId,
    servingFormat,
    expiringWithinDays,
  });
};

export const getCurrentUserCellarStats = async (): Promise<CellarStats> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedCellarError();
  }

  return getCellarStats(user.id);
};

export const getExpirationStatus = (
  bestBeforeDate: Date | null,
): ExpirationStatus => {
  if (!bestBeforeDate) {
    return { status: "unknown", daysRemaining: null };
  }

  const now = new Date();
  const diffTime = bestBeforeDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { status: "expired", daysRemaining };
  }
  if (daysRemaining <= 14) {
    return { status: "critical", daysRemaining };
  }
  if (daysRemaining <= 60) {
    return { status: "warning", daysRemaining };
  }
  return { status: "good", daysRemaining };
};
