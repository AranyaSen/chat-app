import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { InlineAlert } from "@/components/feedback/inlineAlert";
import { Spinner } from "@/components/ui/spinner";
import { useConversationHistory } from "@/features/conversations/hooks/useConversationHistory";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { cn } from "@/lib/cn";
import { formatMessageTime } from "@/lib/format";
import type { UserSearchResult } from "@/features/user/types";
import { Avatar } from "@/components/ui/avatar";

type ChatWindowProps = {
  user: AuthUser;
  conversationId: string | null;
  className?: string;
  selectedChatUser: UserSearchResult;
};

export function ChatWindow({
  user,
  conversationId,
  className,
  selectedChatUser,
}: ChatWindowProps) {
  const {
    data: chatHistory,
    isPending,
    isError,
  } = useConversationHistory(conversationId, selectedChatUser);
  const messages = [...(chatHistory?.data ?? [])].reverse();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [conversationId, messages.length]);

  return (
    <section
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col bg-white/8",
        className,
      )}
    >
      <header className="flex items-center gap-3 border-b border-border/55 px-5 py-3.5">
        <Avatar
          name={selectedChatUser?.username}
          src={selectedChatUser?.image}
          size="md"
        />
        <div className="min-w-0">
          <h2 className="truncate text-[14.5px] font-bold tracking-[-0.02em] text-foreground">
            {selectedChatUser?.username}
          </h2>
          <p className="truncate text-[11px] text-muted-foreground">
            {selectedChatUser?.name}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 scrollbar-subtle sm:px-6">
        {isPending && conversationId ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="size-5" label="Loading conversation" />
          </div>
        ) : null}

        {isError ? (
          <InlineAlert tone="error" className="mx-auto max-w-md">
            Could not load this conversation. Please try again.
          </InlineAlert>
        ) : null}

        {messages.length > 0 ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-2.5">
            {messages.map((message) => {
              const isMine = message.user === user.username;
              const content = message.content;

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isMine ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] sm:max-w-[68%]",
                      isMine
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "glass-surface rounded-bl-md text-foreground",
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {content || "Message unavailable"}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        isMine
                          ? "text-primary-foreground/60"
                          : "text-muted-foreground/70",
                      )}
                    >
                      {formatMessageTime(message.sent_at)}
                      {message.edited_at ? " · edited" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        ) : null}

        {messages.length === 0 ? (
          <div className="mx-auto mt-6 max-w-md">
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/45 px-4 py-3 text-[11px] text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Messaging will be available once the send flow is connected.
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
