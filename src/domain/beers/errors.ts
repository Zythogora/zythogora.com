export class BeerError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidBeerSlugError extends BeerError {
  constructor() {
    super("Invalid beer slug");
  }
}

export class UnknownBeerError extends BeerError {
  constructor() {
    super("Unknown beer");
  }
}

export class InvalidBreweryError extends BeerError {
  constructor() {
    super("Invalid beer's brewery");
  }
}

export class BeerCreationError extends BeerError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedBeerCreationError extends BeerCreationError {
  constructor() {
    super("Unauthorized call to create beer");
  }
}

export class BeerReviewError extends BeerError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedBeerReviewError extends BeerReviewError {
  constructor() {
    super("Unauthorized call to submit review");
  }
}
