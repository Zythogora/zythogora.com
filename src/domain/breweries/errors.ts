export class BreweryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidBrewerySlugError extends BreweryError {
  constructor() {
    super("Invalid brewery slug");
  }
}

export class UnknownBreweryError extends BreweryError {
  constructor() {
    super("Unknown brewery");
  }
}

export class BreweryCreationError extends BreweryError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedBreweryCreationError extends BreweryCreationError {
  constructor() {
    super("Unauthorized call to create brewery");
  }
}
