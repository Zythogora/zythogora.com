export class PlaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaceError";
  }
}

export class UnknownPlaceError extends PlaceError {
  constructor() {
    super("Unknown place");
    this.name = "UnknownPlaceError";
  }
}
