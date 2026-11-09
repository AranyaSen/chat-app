export type SendMessagePayload = {
  recipientId: string | null;
  conversationId: string | null;
  content: string;
};

export type SendMessageAck = {
  ok: boolean;
  message?: unknown;
  error?: string;
};
