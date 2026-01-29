const BeerReviewCardLoader = () => {
  return (
    <div className="col-span-2 grid animate-pulse grid-cols-subgrid">
      <div className="flex flex-row items-center gap-x-4">
        <div className="bg-foreground/25 size-10 rounded" />

        <div className="flex min-w-0 flex-col">
          <div className="bg-foreground/25 my-[5px] h-4.5 w-32 rounded-full" />

          <div className="bg-foreground/15 my-[3px] h-3.5 w-40 rounded-full" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-x-4">
        <div className="flex flex-col items-end">
          <div className="bg-foreground/25 my-[5px] h-4.5 w-16 rounded-full" />

          <div className="bg-foreground/15 my-[3px] h-3.5 w-28 rounded-full" />
        </div>

        <div className="size-6" />
      </div>
    </div>
  );
};

export default BeerReviewCardLoader;
