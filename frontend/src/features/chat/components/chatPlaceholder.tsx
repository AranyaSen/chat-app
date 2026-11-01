import { MessageCircle } from "lucide-react";

import type { AuthUser } from "@/features/auth/types";
import { cn } from "@/lib/cn";

type ChatPlaceholderProps = {
  user: AuthUser;
  className?: string;
};

export function ChatPlaceholder({ user, className }: ChatPlaceholderProps) {
  return (
    <section className={cn("flex min-w-0 flex-1 flex-col bg-white/8", className)}>
      <header className="border-b border-border/55 px-5 py-3.5">
        <h2 className="text-[14.5px] font-bold tracking-[-0.02em] text-foreground">
          Messages
        </h2>
        <p className="text-[11px] text-muted-foreground">
          @{user.username}
        </p>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/80 bg-white/60 text-secondary-foreground shadow-soft backdrop-blur-md">
          <MessageCircle className="size-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-[22px] font-extrabold tracking-[-0.04em] text-foreground">
          No messages yet
        </h3>
        <p className="mt-2 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">
          Messaging isn't connected yet. Once the chat API is available, your
          conversations will show up here.
        </p>
      </div>
    </section>
  );
}
