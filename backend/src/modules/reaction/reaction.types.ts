export type SendReactionPayload = {
  userId: string;
  receipentId: string;
  messageId: string;
  reaction: string;
};
export type SendReactionAck = {
  ok: boolean;
  reaction?: unknown;
  error?: string;
};
