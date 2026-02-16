import type { Decimal } from "@db/internal/prismaNamespace";

export type RawStats = {
  count: number;
  average: Decimal | null;
};
