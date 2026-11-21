import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { InlineAlert } from "@/components/feedback/InlineAlert";
import { Spinner } from "@/components/ui/spinner";
import { Avatar } from "@/components/ui/avatar";
import { useConversationHistory } from "@/features/conversations/hooks/useConversationHistory";
import { useMessages } from "@/features/conversations/hooks/useMessages";
import { useSendMessage } from "@/features/conversations/hooks/useSendMessage";
import { useConversationsStore } from "@/stores/conversationsStore";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { UserSearchResult } from "@/features/user/types";
import { cn } from "@/lib/cn";
import { formatMessageTime } from "@/lib/format";
import { useConversations } from "../hooks/useConversations";

type ChatWindowProps = {
  user: AuthUser;
  conversationId: string | null;
  selectedChatUser: UserSearchResult | null;
  className?: string;
};

export function ChatWindow({
  user,
  conversationId,
  selectedChatUser,
  className,
}: ChatWindowProps) {
  const {
    data: chatHistory,
    isLoading,
    isError,
  } = useConversationHistory(conversationId, selectedChatUser);

  const conversationListQuery = useConversations();

  const initialMessages = useMemo(
    () => [...(chatHistory?.data ?? [])].reverse(),
    [chatHistory?.data],
  );
  const { messages } = useMessages(conversationId, initialMessages);
  const { send, isSending } = useSendMessage();
  const conversationExists = useConversationsStore((s) => s.conversationExists);
  const updateLastMessage = useConversationsStore((s) => s.updateLastMessage);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages?.length]);

  // Reset input height helper
  const resetTextarea = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isSending) return;

    setInput("");
    resetTextarea();

    const ack = await send({
      recipientId: selectedChatUser?.id ?? null,
      conversationId,
      content,
    });
    if (!ack.ok) {
      toast.error(ack.error ?? "Failed to send message.");
      return;
    }
    if (ack.message) {
      const conversation = conversationExists(conversationId);
      if (conversation) {
        updateLastMessage(conversationId, {
          content: ack.message.content ?? undefined,
          sent_at: ack.message.sent_at,
        });
      } else {
        conversationListQuery.refetch();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow textarea
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <section
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col bg-white/8",
        className,
      )}
    >
      <header className="flex items-center gap-3 border-b border-border/55 px-5 py-3.5">
        <Avatar
          name={selectedChatUser?.username ?? ""}
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
        {isLoading && conversationId ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="size-5" label="Loading conversation" />
          </div>
        ) : null}
        {isError ? (
          <InlineAlert tone="error" className="mx-auto max-w-md">
            Could not load this conversation. Please try again.
          </InlineAlert>
        ) : null}
        {messages?.length > 0 ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-2.5">
            {messages?.map((message) => {
              const isMine = message.sender_id === user.id;
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
                    <p className="whitespace-pre-wrap wrap-break-word">
                      {message.content || "Message unavailable"}
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

        {messages?.length === 0 && !isLoading ? (
          <div className="mx-auto mt-6 max-w-md">
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/45 px-4 py-3 text-[11px] text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Say hello to {selectedChatUser?.username}!
            </div>
          </div>
        ) : null}
      </div>

      {/* Input */}
      <div className="border-t border-border/55 px-4 py-3 sm:px-5">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message…"
            className="max-h-36 flex-1 resize-none overflow-y-auto rounded-2xl border border-border/60 bg-white/10 px-4 py-2.5 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 scrollbar-subtle"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            aria-label="Send message"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isSending ? (
              <Spinner className="size-4" />
            ) : (
              <SendHorizonal className="size-4" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
