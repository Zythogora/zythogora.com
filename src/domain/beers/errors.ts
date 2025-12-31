export class BeerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BeerError";
  }
}

export class InvalidBeerSlugError extends BeerError {
  constructor() {
    super("Invalid beer slug");
    this.name = "InvalidBeerSlugError";
  }
}

export class UnknownBeerError extends BeerError {
  constructor() {
    super("Unknown beer");
    this.name = "UnknownBeerError";
  }
}

export class InvalidBreweryError extends BeerError {
  constructor() {
    super("Invalid beer's brewery");
    this.name = "InvalidBreweryError";
  }
}

export class BeerCreationError extends BeerError {
  constructor(message: string) {
    super(message);
    this.name = "BeerCreationError";
  }
}

export class UnauthorizedBeerCreationError extends BeerCreationError {
  constructor() {
    super("Unauthorized call to create beer");
    this.name = "UnauthorizedBeerCreationError";
  }
}

export class BeerReviewError extends BeerError {
  constructor(message: string) {
    super(message);
    this.name = "BeerReviewError";
  }
}

export class UnauthorizedBeerReviewError extends BeerReviewError {
  constructor() {
    super("Unauthorized call to submit review");
    this.name = "UnauthorizedBeerReviewError";
  }
}

export class ImageOptimizationError extends BeerReviewError {
  constructor() {
    super("Failed to optimize image.");
    this.name = "ImageOptimizationError";
  }
}

export class ExplicitContentCheckError extends Error {
  constructor() {
    super("Failed to check for explicit content.");
    this.name = "ExplicitContentCheckError";
  }
}

export class ExplicitContentError extends BeerReviewError {
  constructor() {
    super("The image contains explicit content.");
    this.name = "ExplicitContentError";
  }
}

export class FileUploadError extends BeerReviewError {
  constructor() {
    super("Failed to upload file.");
    this.name = "FileUploadError";
  }
}

export class UnknownPurchaseLocationError extends BeerReviewError {
  constructor() {
    super("Unknown purchase location");
    this.name = "UnknownPurchaseLocationError";
  }
}
