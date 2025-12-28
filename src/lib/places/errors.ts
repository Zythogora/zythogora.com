export class PlaceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownPlaceError extends PlaceError {
  constructor() {
    super("Unknown place");
  }
}
