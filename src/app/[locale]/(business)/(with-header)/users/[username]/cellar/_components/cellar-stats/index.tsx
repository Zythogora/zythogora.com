import { AlertTriangleIcon, BeerIcon, BoxesIcon, WalletIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { CellarStats as CellarStatsType } from "@/domain/cellar/types";
import { cn } from "@/lib/tailwind";

interface CellarStatsProps {
  stats: CellarStatsType;
}

const CellarStats = async ({ stats }: CellarStatsProps) => {
  const t = await getTranslations();

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-4",
        "px-10 md:px-0",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-x-3 rounded-lg p-4",
          "bg-background-muted",
        )}
      >
        <BoxesIcon className="size-8 text-primary" />
        <div>
          <p className="text-2xl font-bold">{stats.totalQuantity}</p>
          <p className="text-sm text-foreground-muted">
            {t("cellar.stats.totalItems")}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-x-3 rounded-lg p-4",
          "bg-background-muted",
        )}
      >
        <BeerIcon className="size-8 text-primary" />
        <div>
          <p className="text-2xl font-bold">{stats.uniqueBeers}</p>
          <p className="text-sm text-foreground-muted">
            {t("cellar.stats.uniqueBeers")}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-x-3 rounded-lg p-4",
          stats.expiringWithin30Days > 0
            ? "bg-yellow-100 dark:bg-yellow-900/30"
            : "bg-background-muted",
        )}
      >
        <AlertTriangleIcon
          className={cn(
            "size-8",
            stats.expiringWithin30Days > 0
              ? "text-yellow-600"
              : "text-foreground-muted",
          )}
        />
        <div>
          <p className="text-2xl font-bold">{stats.expiringWithin30Days}</p>
          <p className="text-sm text-foreground-muted">
            {t("cellar.stats.expiringSoon")}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-x-3 rounded-lg p-4",
          "bg-background-muted",
        )}
      >
        <WalletIcon className="size-8 text-primary" />
        <div>
          <p className="text-2xl font-bold">
            {stats.totalValue !== null
              ? `${stats.totalValue.toFixed(2)}`
              : "-"}
          </p>
          <p className="text-sm text-foreground-muted">
            {t("cellar.stats.totalValue")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CellarStats;
