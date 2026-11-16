import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import type { ChatMessage } from "@/features/conversations/types";

export function useMessages(
  conversationId: string | null,
  initialMessages: ChatMessage[],
) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Sync when history loads or conversation changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Listen for incoming messages on the active conversation
  useEffect(() => {
    if (!conversationId) return;

    const handleNew = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message:new", handleNew);
    return () => {
      socket.off("message:new", handleNew);
    };
  }, [conversationId]);

  return { messages };
}
