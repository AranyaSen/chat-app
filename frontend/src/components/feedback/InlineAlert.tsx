import type { ReactNode } from "react";
import { CircleAlert, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/cn";

const tones = {
  error: {
    wrapper: "border-destructive/15 bg-destructive/[0.055] text-destructive",
    icon: CircleAlert,
  },
  success: {
    wrapper: "border-success-foreground/15 bg-success/75 text-success-foreground",
    icon: CheckCircle2,
  },
  info: {
    wrapper: "border-accent-foreground/15 bg-accent/55 text-accent-foreground",
    icon: Info,
  },
} as const;

type InlineAlertProps = {
  tone?: keyof typeof tones;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function InlineAlert({
  tone = "info",
  title,
  children,
  className,
}: InlineAlertProps) {
  const config = tones[tone];
  const Icon = config.icon;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-2.5 rounded-xl border px-3.5 py-3 text-[13px] leading-relaxed animate-fade",
        config.wrapper,
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="space-y-0.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
