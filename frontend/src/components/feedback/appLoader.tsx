import { Spinner } from "@/components/ui/spinner";

export function AppLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Spinner className="size-5" label="Loading" />
    </div>
  );
}
