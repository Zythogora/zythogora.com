import { cn } from "@/lib/tailwind";

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "bg-foreground/(--opacity) animate-pulse rounded",
        className,
      )}
    />
  );
};

export default Skeleton;
