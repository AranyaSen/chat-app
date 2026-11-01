import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/cn";

type SpinnerProps = {
  className?: string;
  label?: string;
};

function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <span className="inline-flex items-center justify-center" role="status">
      <LoaderCircle
        className={cn("size-4 animate-spin", className)}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner };
