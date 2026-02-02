import type { StorageLocations } from "@db/client";

export type RawStorageLocation = StorageLocations;

export type StorageLocation = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
};
