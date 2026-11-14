import { useState, type FormEvent } from "react";
import { LogOut, Search, X } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ConversationList } from "@/features/chat/components/conversationList";
import type {
  Conversation,
  ConversationListItem,
} from "@/features/chat/types";
import type { AuthUser } from "@/features/auth/types";
import { useUserSearch } from "@/features/user/hooks/useUserSearch";
import type { UserSearchResult } from "@/features/user/types";
import { cn } from "@/lib/cn";

type ChatSidebarProps = {
  user: AuthUser;
  conversations: ConversationListItem[];
  selectedConversationId: string | null;
  isLoadingConversations: boolean;
  isConversationsError: boolean;
  isResolvingUser: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onSelectUser: (user: UserSearchResult) => void;
  onSignOut: () => void;
  isSigningOut: boolean;
  className?: string;
};

export function ChatSidebar({
  user,
  conversations,
  selectedConversationId,
  isLoadingConversations,
  isConversationsError,
  isResolvingUser,
  onSelectConversation,
  onSelectUser,
  onSignOut,
  isSigningOut,
  className,
}: ChatSidebarProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isFetching } = useUserSearch(searchTerm);
  const results = (data?.data ?? []).filter((result) => result.id !== user.id);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleSelectUser = (result: UserSearchResult) => {
    onSelectUser(result);
    clearSearch();
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

        <form className="relative mt-4" onSubmit={handleSearch} noValidate>
          <button
            type="submit"
            aria-label="Search users"
            className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground/70 transition hover:bg-white/70 hover:text-foreground"
          >
            <Search className="size-4" aria-hidden="true" />
          </button>
          <Input
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              if (!event.target.value.trim()) setSearchTerm("");
            }}
            placeholder="Search by username"
            aria-label="Search users by username"
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
        </form>

        {searchTerm ? (
          <div className="mt-2.5 overflow-hidden rounded-2xl border border-white/70 bg-white/55 shadow-soft backdrop-blur-md">
            {isFetching ? (
              <div className="flex items-center justify-center gap-2 px-3 py-4 text-[11px] text-muted-foreground">
                <Spinner className="size-3.5" label="Searching users" />
                Searching
              </div>
            ) : results.length > 0 ? (
              <ul className="max-h-56 overflow-y-auto p-1.5 scrollbar-subtle">
                {results.map((result) => {
                  const name =
                    result.name ?? result.username ?? `@${result.user_id}`;

                  return (
                    <li key={result.id}>
                      <button
                        type="button"
                        disabled={isResolvingUser}
                        onClick={() => handleSelectUser(result)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-white/75 disabled:opacity-60"
                      >
                        <Avatar name={name} src={result.image} size="xs" />
                        <span className="min-w-0">
                          <span className="block truncate text-[12px] font-bold text-foreground">
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
              <p className="px-3 py-4 text-center text-[11px] text-muted-foreground">
                No users found for “{searchTerm}”.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 scrollbar-subtle">
        <ConversationList
          conversations={conversations}
          currentUserId={user.id}
          selectedConversationId={selectedConversationId}
          isLoading={isLoadingConversations}
          isError={isConversationsError}
          onSelect={onSelectConversation}
        />
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
