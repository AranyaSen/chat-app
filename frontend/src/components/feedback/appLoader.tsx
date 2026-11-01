import { Spinner } from "@/components/ui/spinner";

export function AppLoader() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
      <Spinner className="size-5" label="Loading" />
      <span className="text-xs font-medium text-muted-foreground">
        Loading…
      </span>
    </div>
  );
}
