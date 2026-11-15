import { MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { ConversationListItem } from "@/features/conversations/types";
import {
  getPeerHandle,
  getPeerName,
} from "@/features/conversations/utils";
import { cn } from "@/lib/cn";
import { formatMessageTime } from "@/lib/format";

type ConversationListProps = {
  conversations: ConversationListItem[];
  selectedConversationId: string | null;
  isLoading: boolean;
  isError: boolean;
  onSelect: (conversationId: string) => void;
};

export function ConversationList({
  conversations,
  selectedConversationId,
  isLoading,
  isError,
  onSelect,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-1.5" aria-label="Loading conversations">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-3 rounded-2xl px-3 py-3"
          >
            <span className="size-9 rounded-full bg-muted" />
            <span className="min-w-0 flex-1 space-y-2">
              <span className="block h-2.5 w-24 rounded-full bg-muted" />
              <span className="block h-2 w-32 rounded-full bg-muted/70" />
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="px-3 py-6 text-center text-[12px] leading-relaxed text-muted-foreground">
        Could not load conversations. Try refreshing the page.
      </p>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-8 text-center">
        <span className="flex size-11 items-center justify-center rounded-2xl border border-white/80 bg-white/55 text-secondary-foreground shadow-soft">
          <MessagesSquare className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-3 text-[12.5px] font-bold text-foreground">
          No conversations yet
        </p>
        <p className="mt-1 max-w-[13rem] text-[11px] leading-relaxed text-muted-foreground">
          Search for someone above to start a conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map(({ conversationId, user: peer, lastMessage }) => {
        if (!conversationId) return null;

        const title = getPeerName(peer);
        const handle = getPeerHandle(peer);
        const timestamp = lastMessage?.sent_at;
        const isSelected = conversationId === selectedConversationId;

        return (
          <button
            key={conversationId}
            type="button"
            onClick={() => onSelect(conversationId)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-200",
              isSelected
                ? "bg-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_-20px_rgba(43,34,81,0.5)]"
                : "hover:bg-white/45",
            )}
          >
            <Avatar
              name={title}
              src={peer?.image}
              size="sm"
              className="ring-white/80"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[12.5px] font-bold text-foreground">
                  {title}
                </span>
                {timestamp ? (
                  <span className="shrink-0 text-[10px] text-muted-foreground/75">
                    {formatMessageTime(timestamp)}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="truncate text-[11px] text-muted-foreground">
                  {lastMessage?.content}
                </span>
                {handle ? (
                  <span className="shrink-0 text-[10px] font-medium text-secondary-foreground/75">
                    {handle}
                  </span>
                ) : null}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
