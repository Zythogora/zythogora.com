export class UserRecordNotFoundError extends Error {
  constructor() {
    super("User record not found");
    this.name = "UserRecordNotFoundError";
  }
}
