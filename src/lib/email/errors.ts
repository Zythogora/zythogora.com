export class EmailError extends Error {
  constructor() {
    super("Failed to send email");
    this.name = "EmailError";
  }
}
