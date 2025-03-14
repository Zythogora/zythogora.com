export class UserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownUserError extends UserError {
  constructor() {
    super("Unknown user");
  }
}

export class ReviewError extends UserError {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownReviewError extends ReviewError {
  constructor() {
    super("Unknown review");
  }
}
