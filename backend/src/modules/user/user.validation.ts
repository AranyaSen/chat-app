import z from "zod";

export const getConversationSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
});

export const getConversationRequestSchema = z.object({
  params: getConversationSchema,
});
