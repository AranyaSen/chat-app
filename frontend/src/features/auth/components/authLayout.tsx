import type { ReactNode } from "react";

import { AmbientBackground } from "@/components/layout/ambientBackground";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
      <AmbientBackground />

      <main className="relative w-full max-w-[25rem] rounded-[26px] glass-panel px-6 py-8 shadow-soft sm:px-9 sm:py-10">
        {children}
      </main>
    </div>
  );
}
