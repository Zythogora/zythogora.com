export class StorageLocationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedStorageLocationError extends StorageLocationError {
  constructor() {
    super("Unauthorized storage location operation");
  }
}

export class UnknownStorageLocationError extends StorageLocationError {
  constructor() {
    super("Unknown storage location");
  }
}

export class DuplicateStorageLocationError extends StorageLocationError {
  constructor() {
    super("Storage location with this name already exists");
  }
}

export class StorageLocationInUseError extends StorageLocationError {
  constructor() {
    super("Storage location is in use by cellar items");
  }
}
