export class BreweryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BreweryError";
  }
}

export class InvalidBrewerySlugError extends BreweryError {
  constructor() {
    super("Invalid brewery slug");
    this.name = "InvalidBrewerySlugError";
  }
}

export class UnknownBreweryError extends BreweryError {
  constructor() {
    super("Unknown brewery");
    this.name = "UnknownBreweryError";
  }
}

export class BreweryCreationError extends BreweryError {
  constructor(message: string) {
    super(message);
    this.name = "BreweryCreationError";
  }
}

export class UnauthorizedBreweryCreationError extends BreweryCreationError {
  constructor() {
    super("Unauthorized call to create brewery");
    this.name = "UnauthorizedBreweryCreationError";
  }
}
