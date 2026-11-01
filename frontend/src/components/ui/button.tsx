import * as React from "react";

import {
  buttonVariants,
  type ButtonVariants,
} from "@/components/ui/buttonVariants";
import { cn } from "@/lib/cn";

export type ButtonProps = React.ComponentProps<"button"> & ButtonVariants;

function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button };
