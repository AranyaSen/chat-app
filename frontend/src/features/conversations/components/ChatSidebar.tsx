import { useMemo, useState } from "react";
import { LogOut, Search, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ConversationList } from "@/features/conversations/components/ConversationList";
import { useConversations } from "@/features/conversations/hooks/useConversations";
import { useConversationsStore } from "@/stores/conversationsStore";
import { useLogout } from "@/features/auth/hooks/useLogout";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { useUserSearch } from "@/features/user/hooks/useUserSearch";
import type { UserSearchResult } from "@/features/user/types";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/cn";

type ChatSidebarProps = {
  user: AuthUser;
  selectedConversationId: string | null;
  onSelectChatUser: (user: UserSearchResult) => void;
  className?: string;
};

export function ChatSidebar({
  user,
  selectedConversationId,
  onSelectChatUser,
  className,
}: ChatSidebarProps) {
  const [searchInput, setSearchInput] = useState("");
  const searchTerm = useDebounce(searchInput.trim(), 400);

  const {
    isPending: isLoadingConversations,
    isError: isConversationsError,
  } = useConversations();

  const rawConversations = useConversationsStore((s) => s.conversations);
  const showLoadingState = isLoadingConversations && rawConversations.length === 0;

  const conversations = useMemo(
    () =>
      [...rawConversations].sort(
        (a, b) =>
          new Date(b.lastMessage?.sent_at ?? 0).getTime() -
          new Date(a.lastMessage?.sent_at ?? 0).getTime(),
      ),
    [rawConversations],
  );

  const {
    data: searchData,
    isFetching: isSearchingUsers,
    isError: isSearchError,
    error: searchError,
  } = useUserSearch(searchTerm);

  const { logout, isLoggingOut } = useLogout();
  const results = searchData?.data ?? [];
  const isSearching = searchInput.trim() !== searchTerm || isSearchingUsers;
  const hasQuery = searchInput.trim().length > 0;

  const clearSearch = () => {
    setSearchInput("");
  };

  return (
    <aside className={cn("flex min-h-0 flex-col bg-white/12", className)}>
      <div className="border-b border-border/55 px-5 pb-4 pt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/65">
          Your messages
        </p>
        <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.045em] text-foreground">
          Chats
        </h1>

        <div className="relative mt-4">
          <span
            aria-hidden="true"
            className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground/70"
          >
            <Search className="size-4" />
          </span>
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") clearSearch();
            }}
            placeholder="Search by username"
            aria-label="Search users by username"
            autoComplete="off"
            spellCheck={false}
            className="h-10 rounded-xl bg-white/55 pl-9 pr-10 text-[12.5px]"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-white/70 hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto p-2.5 scrollbar-subtle"
        aria-busy={hasQuery && isSearching}
      >
        {hasQuery ? (
          <div className="space-y-1">
            <p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/60">
              {isSearching ? "Searching" : "Results"}
            </p>

            {isSearching ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl px-3 py-6 text-[11px] text-muted-foreground">
                <Spinner className="size-3.5" label="Searching users" />
                Searching users
              </div>
            ) : isSearchError ? (
              <p className="rounded-2xl px-4 py-6 text-center text-[11.5px] leading-relaxed text-muted-foreground">
                {searchError?.message}
              </p>
            ) : results.length > 0 ? (
              <ul className="space-y-1">
                {results.map((result) => {
                  const name =
                    result.name ?? result.username ?? `@${result.username}`;

                  return (
                    <li key={result.id}>
                      <button
                        type="button"
                        onClick={() => onSelectChatUser(result)}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-200 hover:bg-white/45"
                      >
                        <Avatar
                          name={name}
                          src={result.image}
                          size="sm"
                          className="ring-white/80"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-[12.5px] font-bold text-foreground">
                            {name}
                          </span>
                          {result.username ? (
                            <span className="block truncate text-[10.5px] text-muted-foreground">
                              @{result.username}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <span className="flex size-11 items-center justify-center rounded-2xl border border-white/80 bg-white/55 text-secondary-foreground shadow-soft">
                  <Search className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[12.5px] font-bold text-foreground">
                  No users found
                </p>
                <p className="mt-1 max-w-56 text-[11px] leading-relaxed text-muted-foreground">
                  Nothing matched “{searchTerm}”. Check the username and try
                  again.
                </p>
              </div>
            )}
          </div>
        ) : (
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            isLoading={showLoadingState}
            onSelectChatUser={onSelectChatUser}
            isError={isConversationsError}
          />
        )}
      </div>

      <div className="border-t border-border/55 p-3.5">
        <div className="glass-surface flex items-center gap-2.5 rounded-2xl p-2.5">
          <Avatar name={user.name} src={user.image} size="sm" />
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
            disabled={isLoggingOut}
            onClick={() => void logout()}
          >
            {isLoggingOut ? (
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
