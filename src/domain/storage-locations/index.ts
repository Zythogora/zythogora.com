"server only";

import { nanoid } from "nanoid";
import { cache } from "react";

import {
  DuplicateStorageLocationError,
  UnauthorizedStorageLocationError,
  UnknownStorageLocationError,
} from "@/domain/storage-locations/errors";
import type { StorageLocation } from "@/domain/storage-locations/types";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getStorageLocationsByUser = cache(
  async (userId: string): Promise<StorageLocation[]> => {
    const locations = await prisma.storageLocations.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return locations.map((location) => ({
      id: location.id,
      name: location.name,
      userId: location.userId,
      createdAt: location.createdAt,
    }));
  },
);

export const getStorageLocationById = cache(
  async (locationId: string): Promise<StorageLocation> => {
    const location = await prisma.storageLocations.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new UnknownStorageLocationError();
    }

    return {
      id: location.id,
      name: location.name,
      userId: location.userId,
      createdAt: location.createdAt,
    };
  },
);

export const getOrCreateStorageLocation = async (
  name: string,
): Promise<StorageLocation> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedStorageLocationError();
  }

  const existingLocation = await prisma.storageLocations.findUnique({
    where: {
      userId_name: {
        userId: user.id,
        name,
      },
    },
  });

  if (existingLocation) {
    return {
      id: existingLocation.id,
      name: existingLocation.name,
      userId: existingLocation.userId,
      createdAt: existingLocation.createdAt,
    };
  }

  const location = await prisma.storageLocations.create({
    data: {
      id: nanoid(),
      name,
      userId: user.id,
    },
  });

  return {
    id: location.id,
    name: location.name,
    userId: location.userId,
    createdAt: location.createdAt,
  };
};

export const createStorageLocation = async (
  name: string,
): Promise<StorageLocation> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedStorageLocationError();
  }

  const existingLocation = await prisma.storageLocations.findUnique({
    where: {
      userId_name: {
        userId: user.id,
        name,
      },
    },
  });

  if (existingLocation) {
    throw new DuplicateStorageLocationError();
  }

  const location = await prisma.storageLocations.create({
    data: {
      id: nanoid(),
      name,
      userId: user.id,
    },
  });

  return {
    id: location.id,
    name: location.name,
    userId: location.userId,
    createdAt: location.createdAt,
  };
};

export const updateStorageLocation = async (
  locationId: string,
  name: string,
): Promise<StorageLocation> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedStorageLocationError();
  }

  const location = await prisma.storageLocations.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    throw new UnknownStorageLocationError();
  }

  if (location.userId !== user.id) {
    throw new UnauthorizedStorageLocationError();
  }

  const existingLocation = await prisma.storageLocations.findUnique({
    where: {
      userId_name: {
        userId: user.id,
        name,
      },
    },
  });

  if (existingLocation && existingLocation.id !== locationId) {
    throw new DuplicateStorageLocationError();
  }

  const updatedLocation = await prisma.storageLocations.update({
    where: { id: locationId },
    data: { name },
  });

  return {
    id: updatedLocation.id,
    name: updatedLocation.name,
    userId: updatedLocation.userId,
    createdAt: updatedLocation.createdAt,
  };
};

export const deleteStorageLocation = async (
  locationId: string,
): Promise<void> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedStorageLocationError();
  }

  const location = await prisma.storageLocations.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    throw new UnknownStorageLocationError();
  }

  if (location.userId !== user.id) {
    throw new UnauthorizedStorageLocationError();
  }

  await prisma.storageLocations.delete({
    where: { id: locationId },
  });
};

export const getCurrentUserStorageLocations = async (): Promise<
  StorageLocation[]
> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedStorageLocationError();
  }

  return getStorageLocationsByUser(user.id);
};
