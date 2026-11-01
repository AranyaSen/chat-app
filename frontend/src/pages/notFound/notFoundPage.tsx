import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { AmbientBackground } from "@/components/layout/ambientBackground";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { cn } from "@/lib/cn";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4">
      <AmbientBackground />
      <div className="glass-panel w-full max-w-md rounded-[28px] p-8 text-center sm:p-10">
        <p className="text-5xl font-extrabold leading-none tracking-[-0.06em] text-foreground">
          404
        </p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
          The link may be broken, or the page may have moved.
        </p>
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-6 w-full",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
