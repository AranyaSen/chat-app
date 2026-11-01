import * as React from "react";

import { cn } from "@/lib/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-border/80 bg-white/62 px-3.5 text-sm text-foreground shadow-[inset_0_1px_2px_rgba(43,34,81,0.03)] outline-none transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-ring/45 focus:bg-white/85 focus:ring-4 focus:ring-ring/10 aria-invalid:border-destructive/40 aria-invalid:ring-destructive/10 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full resize-none rounded-xl border border-border/80 bg-white/62 px-3.5 py-3 text-sm text-foreground shadow-[inset_0_1px_2px_rgba(43,34,81,0.03)] outline-none transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-ring/45 focus:bg-white/85 focus:ring-4 focus:ring-ring/10 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Input, Textarea };
