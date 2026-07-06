import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Textarea = ({ className, ...restProps }: ComponentProps<"textarea">) => {
  return (
    <div
      data-slot="textarea-container"
      className={cn(
        "h-fit",
        "shadow-hard-drop rounded",
        "has-aria-invalid:[--hard-shadow-color:var(--color-destructive)]",
        className,
      )}
    >
      <textarea
        {...restProps}
        data-slot="textarea"
        className={cn(
          "bg-background border-foreground block size-full min-w-0 resize-y rounded border-2 px-5 py-4",
          "text-sm md:text-base",
          "dark:bg-stone-700",
          "placeholder:text-foreground-muted placeholder:select-none",
          "disabled:bg-background-muted disabled:pointer-events-none disabled:cursor-not-allowed",
          "aria-invalid:border-destructive",
          "aria-invalid:placeholder:text-destructive/50",
        )}
      />
    </div>
  );
};

export default Textarea;
