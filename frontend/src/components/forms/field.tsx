import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Field({
  id,
  label,
  error,
  hint,
  action,
  children,
  className,
}: FieldProps) {
  const messageId = `${id}-message`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>
      {children}
      {error ? (
        <p
          id={messageId}
          className="text-[12px] font-medium text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-[12px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
