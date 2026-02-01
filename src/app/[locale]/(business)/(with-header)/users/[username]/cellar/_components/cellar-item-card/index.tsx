"use client";

import { ServingFrom } from "@db/enums";

import { MapPinIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

import {
  adjustQuantityAction,
  moveItemAction,
} from "@/app/[locale]/(business)/(with-header)/users/[username]/cellar/actions";
import ServingFromBottleIcon from "@/app/_components/icons/serving-from/bottle";
import ServingFromCanIcon from "@/app/_components/icons/serving-from/can";
import Button from "@/app/_components/ui/button";
import { getExpirationStatus } from "@/domain/cellar";
import type { CellarItem } from "@/domain/cellar/types";
import type { StorageLocation } from "@/domain/storage-locations/types";
import { Link } from "@/lib/i18n";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { cn } from "@/lib/tailwind";

interface CellarItemCardProps {
  item: CellarItem;
  storageLocations: StorageLocation[];
  username: string;
}

const CellarItemCard = ({
  item,
  storageLocations,
  username,
}: CellarItemCardProps) => {
  const t = useTranslations();

  const [, adjustAction] = useActionState(adjustQuantityAction, null);
  const [, moveAction] = useActionState(moveItemAction, null);

  const expirationStatus = getExpirationStatus(item.bestBeforeDate);

  const getExpirationColor = () => {
    switch (expirationStatus.status) {
      case "expired":
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "good":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default:
        return "text-foreground-muted bg-background-muted";
    }
  };

  const getExpirationIndicator = () => {
    switch (expirationStatus.status) {
      case "expired":
      case "critical":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "good":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const reviewUrl = `${generatePath(Routes.REVIEW_FORM, {
    brewerySlug: item.beer.brewery.slug,
    beerSlug: item.beer.slug,
  })}?fromCellar=${item.id}&servingFrom=${item.servingFormat}${item.bestBeforeDate ? `&bestBefore=${item.bestBeforeDate.toISOString()}` : ""}`;

  return (
    <div
      className={cn(
        "flex flex-col gap-y-3 rounded-lg border-2 p-4",
        "border-foreground/10 bg-background",
      )}
    >
      <div className="flex items-start justify-between gap-x-4">
        <div className="flex min-w-0 items-center gap-x-3">
          {/* Expiration indicator */}
          <div
            className={cn(
              "size-3 shrink-0 rounded-full",
              getExpirationIndicator(),
            )}
          />

          <div className="min-w-0">
            <Link
              href={generatePath(Routes.BEER, {
                brewerySlug: item.beer.brewery.slug,
                beerSlug: item.beer.slug,
              })}
              className="hover:underline"
            >
              <h3 className="font-title truncate text-lg font-bold">
                {item.beer.name}
              </h3>
            </Link>
            <p className="truncate text-sm text-foreground-muted">
              {item.beer.brewery.name}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-x-2">
          <span className="text-xl font-bold">x{item.quantity}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {/* Serving format */}
        <div className="flex items-center gap-x-1.5">
          {item.servingFormat === ServingFrom.BOTTLE ? (
            <ServingFromBottleIcon size={16} className="fill-foreground" />
          ) : (
            <ServingFromCanIcon size={16} className="fill-foreground" />
          )}
          <span>
            {t(`cellar.form.servingFormat.values.${item.servingFormat}`)}
          </span>
        </div>

        {/* Best before date */}
        {item.bestBeforeDate ? (
          <div
            className={cn(
              "flex items-center gap-x-1.5 rounded px-2 py-0.5",
              getExpirationColor(),
            )}
          >
            <span>
              {expirationStatus.status === "expired"
                ? t("cellar.item.expired")
                : expirationStatus.daysRemaining !== null
                  ? t("cellar.item.expiresIn", {
                      days: expirationStatus.daysRemaining,
                    })
                  : item.bestBeforeDate.toLocaleDateString()}
            </span>
          </div>
        ) : null}

        {/* Storage location */}
        <div className="flex items-center gap-x-1.5">
          <MapPinIcon size={14} className="text-foreground-muted" />
          <form action={moveAction}>
            <input type="hidden" name="itemId" value={item.id} />
            <select
              name="storageLocationId"
              value={item.storageLocation?.id ?? ""}
              onChange={(e) => {
                const form = e.target.closest("form");
                if (form) {
                  const formData = new FormData(form);
                  formData.set("storageLocationId", e.target.value || "");
                  moveAction(formData);
                }
              }}
              className={cn(
                "rounded border border-foreground/20 bg-transparent px-1.5 py-0.5 text-sm",
                "focus:border-primary focus:outline-none",
              )}
            >
              <option value="">{t("cellar.form.storageLocation.none")}</option>
              {storageLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </form>
        </div>

        {/* Purchase location */}
        {item.purchaseLocation ? (
          <div className="flex items-center gap-x-1.5 text-foreground-muted">
            <ShoppingBagIcon size={14} />
            <span>{item.purchaseLocation.description}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-x-4 pt-2">
        <div className="flex items-center gap-x-2">
          <form action={adjustAction}>
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="delta" value="-1" />
            <Button
              type="submit"
              variant="outline"
              className="size-8 p-0"
            >
              <MinusIcon size={16} />
            </Button>
          </form>

          <form action={adjustAction}>
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="delta" value="1" />
            <Button
              type="submit"
              variant="outline"
              className="size-8 p-0"
            >
              <PlusIcon size={16} />
            </Button>
          </form>
        </div>

        <Link href={reviewUrl}>
          <Button className="px-4 py-2">
            {t("cellar.item.openAndReview")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CellarItemCard;
