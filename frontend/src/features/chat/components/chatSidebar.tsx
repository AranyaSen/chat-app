import { LogOut } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { AuthUser } from "@/features/auth/types";
import { cn } from "@/lib/cn";

type ChatSidebarProps = {
  user: AuthUser;
  onSignOut: () => void;
  isSigningOut: boolean;
  className?: string;
};

export function ChatSidebar({
  user,
  onSignOut,
  isSigningOut,
  className,
}: ChatSidebarProps) {
  return (
    <aside className={cn("flex min-h-0 flex-col bg-white/12", className)}>
      <div className="border-b border-border/55 px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/65">
          Signed in as
        </p>
        <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.045em] text-foreground">
          Chats
        </h1>
      </div>

      <div className="hidden min-h-0 flex-1 flex-col items-center justify-center px-5 py-8 text-center md:flex">
        <p className="text-[12.5px] font-bold text-foreground">
          No conversations yet
        </p>
        <p className="mt-1 max-w-[13rem] text-[11px] leading-relaxed text-muted-foreground">
          Your chats will appear here once the messaging API is connected.
        </p>
      </div>

      <div className="border-t border-border/55 p-3.5">
        <div className="glass-surface flex items-center gap-2.5 rounded-2xl p-2.5">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-bold tracking-[-0.01em] text-foreground">
              {user.name}
            </p>
            <p className="truncate text-[10.5px] text-muted-foreground">
              @{user.username}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:bg-white/70 hover:text-destructive"
            aria-label="Sign out"
            title="Sign out"
            disabled={isSigningOut}
            onClick={onSignOut}
          >
            {isSigningOut ? (
              <Spinner className="size-4" label="Signing out" />
            ) : (
              <LogOut className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
