import { cn } from "@/lib/tailwind";

const ReviewPictureGridLoader = () => {
  return (
    <div
      className={cn(
        "mb-4 grid gap-x-3",
        "grid-cols-3 md:grid-cols-5",
        "*:aspect-square *:animate-pulse *:rounded-md",
        "*:bg-stone-200 dark:*:bg-stone-800",
        "*:nth-[n+4]:hidden md:*:nth-[n+4]:block",
      )}
    >
      <div />

      <div />

      <div />

      <div />

      <div />
    </div>
  );
};

export default ReviewPictureGridLoader;
