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
