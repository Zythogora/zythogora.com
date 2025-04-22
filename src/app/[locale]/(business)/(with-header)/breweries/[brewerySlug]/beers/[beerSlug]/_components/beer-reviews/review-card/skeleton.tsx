import { ChevronRightIcon } from "lucide-react";

import Skeleton from "@/components/ui/skeleton";

const BeerReviewCardSkeleton = () => {
  return (
    <div className="col-span-2 grid grid-cols-subgrid">
      <div className="flex flex-row items-center gap-x-3">
        <Skeleton className="size-11 [--opacity:30%]" />

        <div className="flex min-w-0 flex-col gap-y-1">
          <Skeleton className="h-6 w-32 [--opacity:30%]" />

          <Skeleton className="h-4 w-24 [--opacity:15%]" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-x-4">
        <div className="flex flex-col items-end gap-y-1">
          <Skeleton className="h-6 w-16 [--opacity:30%]" />

          <Skeleton className="h-4 w-28 [--opacity:15%]" />
        </div>

        <ChevronRightIcon className="text-foreground/30 size-6 animate-pulse" />
      </div>
    </div>
  );
};

export default BeerReviewCardSkeleton;
