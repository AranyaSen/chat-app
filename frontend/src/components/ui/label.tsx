import * as React from "react";

import { cn } from "@/lib/cn";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-[13px] font-semibold leading-none text-foreground/85",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
