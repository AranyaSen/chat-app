import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import type { ChatMessage } from "@/features/conversations/types";
import { useConversationsStore } from "@/stores/conversationsStore";

export function useMessages(
  conversationId: string | null,
  initialMessages: ChatMessage[],
) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const updateLastMessage = useConversationsStore((s) => s.updateLastMessage);

  // Sync when history loads or conversation changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Listen for incoming messages on the active conversation
  useEffect(() => {
    if (!conversationId) return;

    const handleNew = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      updateLastMessage(conversationId, {
        content: message.content ?? undefined,
        sent_at: message.sent_at,
      });
    };

    socket.on("message:new", handleNew);
    return () => {
      socket.off("message:new", handleNew);
    };
  }, [conversationId, updateLastMessage]);

  return { messages };
}
