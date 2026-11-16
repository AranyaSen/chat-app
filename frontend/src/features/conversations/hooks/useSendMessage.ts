import { useState } from "react";
import { socket } from "@/lib/socket";
import type { ChatMessage } from "@/features/conversations/types";

type SendPayload = {
  recipientId: string | null;
  conversationId: string | null;
  content: string;
};

type Ack = { ok: boolean; message?: ChatMessage; error?: string };

const SEND_TIMEOUT_MS = 10_000;

export function useSendMessage() {
  const [isSending, setIsSending] = useState(false);

  const send = async (payload: SendPayload): Promise<Ack> => {
    if (!socket.connected) {
      return {
        ok: false,
        error: "You're offline. Please reconnect and try again.",
      };
    }

    setIsSending(true);
    try {
      return await socket
        .timeout(SEND_TIMEOUT_MS)
        .emitWithAck("message:send", payload);
    } catch (error) {
      return { ok: false, error: error?.message };
    } finally {
      setIsSending(false);
    }
  };

  return { send, isSending };
}
