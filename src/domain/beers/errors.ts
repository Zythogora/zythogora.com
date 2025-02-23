export class BeerError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidSlugError extends BeerError {
  constructor() {
    super("Invalid slug");
  }
}

export class UnknownBeerError extends BeerError {
  constructor() {
    super("Unknown beer");
  }
}

export class InvalidBreweryError extends BeerError {
  constructor() {
    super("Invalid brewery");
  }
}
