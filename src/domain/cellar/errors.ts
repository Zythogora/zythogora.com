export class CellarError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedCellarError extends CellarError {
  constructor() {
    super("Unauthorized cellar operation");
  }
}

export class UnknownCellarItemError extends CellarError {
  constructor() {
    super("Unknown cellar item");
  }
}

export class InvalidQuantityError extends CellarError {
  constructor() {
    super("Invalid quantity");
  }
}

export class UnknownBeerError extends CellarError {
  constructor() {
    super("Unknown beer");
  }
}
