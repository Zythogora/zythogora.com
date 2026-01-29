export class ExhaustiveCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExhaustiveCheckError";
  }
}

export const exhaustiveCheck = ({
  error,
}: {
  value: never;
  error: string;
}): never => {
  throw new ExhaustiveCheckError(error);
};
