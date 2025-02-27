export class ExhaustiveCheckError extends Error {
  constructor(message: string) {
    super(message);
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
