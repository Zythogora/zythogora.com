"use client";

import { ServingFrom } from "@db/enums";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import type { StorageLocation } from "@/domain/storage-locations/types";
import { cn } from "@/lib/tailwind";

interface CellarFiltersProps {
  storageLocations: StorageLocation[];
  currentFilters: {
    storageLocationId?: string;
    servingFormat?: string;
    expiringWithinDays?: number;
  };
}

const CellarFilters = ({
  storageLocations,
  currentFilters,
}: CellarFiltersProps) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Reset page when filters change
      params.delete("page");

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        "px-10 md:px-0",
      )}
    >
      <select
        value={currentFilters.storageLocationId ?? ""}
        onChange={(e) =>
          updateFilter("storageLocationId", e.target.value || undefined)
        }
        className={cn(
          "rounded border-2 border-foreground/20 px-3 py-2",
          "bg-background text-sm",
          "focus:border-primary focus:outline-none",
        )}
      >
        <option value="">{t("cellar.filters.allLocations")}</option>
        {storageLocations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>

      <select
        value={currentFilters.servingFormat ?? ""}
        onChange={(e) =>
          updateFilter("servingFormat", e.target.value || undefined)
        }
        className={cn(
          "rounded border-2 border-foreground/20 px-3 py-2",
          "bg-background text-sm",
          "focus:border-primary focus:outline-none",
        )}
      >
        <option value="">{t("cellar.filters.allFormats")}</option>
        <option value={ServingFrom.BOTTLE}>
          {t("cellar.form.servingFormat.values.BOTTLE")}
        </option>
        <option value={ServingFrom.CAN}>
          {t("cellar.form.servingFormat.values.CAN")}
        </option>
      </select>

      <select
        value={currentFilters.expiringWithinDays?.toString() ?? ""}
        onChange={(e) =>
          updateFilter("expiringWithinDays", e.target.value || undefined)
        }
        className={cn(
          "rounded border-2 border-foreground/20 px-3 py-2",
          "bg-background text-sm",
          "focus:border-primary focus:outline-none",
        )}
      >
        <option value="">{t("cellar.filters.allDates")}</option>
        <option value="30">{t("cellar.filters.expiring30Days")}</option>
        <option value="60">{t("cellar.filters.expiring60Days")}</option>
        <option value="90">{t("cellar.filters.expiring90Days")}</option>
      </select>
    </div>
  );
};

export default CellarFilters;
