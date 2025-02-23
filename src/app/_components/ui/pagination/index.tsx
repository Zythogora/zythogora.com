"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { Link, usePathname } from "@/lib/i18n";

interface PaginationProps {
  current: number;
  total: number;
}

const Pagination = ({ current, total }: PaginationProps) => {
  const t = useTranslations();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getPageUrl = useCallback(
    (index: number) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (index < 1) {
        newSearchParams.delete("page");
      } else if (index > total) {
        newSearchParams.set("page", total.toString());
      } else {
        newSearchParams.set("page", index.toString());
      }

      return `${pathname}?${newSearchParams.toString()}`;
    },
    [pathname, searchParams, total],
  );

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className="mx-auto flex w-full justify-center"
    >
      <ul className="flex flex-row items-center gap-x-3">
        <li>
          <Link
            href={getPageUrl(current - 1)}
            aria-label={t("pagination.previous")}
            aria-disabled={current === 1 ? true : undefined}
            role={current === 1 ? "link" : undefined}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </Link>
        </li>

        <li>
          <p className="text-foreground-muted text-sm" aria-live="polite">
            {t.rich("pagination.page", {
              page: current,
              total,
              highlight: (chunks) => (
                <span className="text-foreground">{chunks}</span>
              ),
            })}
          </p>
        </li>

        <li>
          <Link
            href={getPageUrl(current + 1)}
            aria-label={t("pagination.next")}
            aria-disabled={current === total ? true : undefined}
            role={current === total ? "link" : undefined}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
