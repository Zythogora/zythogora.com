export class BreweryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidSlugError extends BreweryError {
  constructor() {
    super("Invalid brewery slug");
  }
}

export class UnknownBreweryError extends BreweryError {
  constructor() {
    super("Unknown brewery");
  }
}
