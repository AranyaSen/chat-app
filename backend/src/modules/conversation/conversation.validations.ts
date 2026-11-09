import z from "zod";

export const getConversationSchema = z.object({
  conversationId: z.string().trim().min(1, "Conversation ID is required"),
});

export const resolveDirectConversationSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const getConversationHistorySchema = z.object({
  conversationId: z.string().trim().min(1, "Conversation ID is reuqired"),
});

export const getConversationRequestSchema = z.object({
  params: getConversationSchema,
});

export const resolveDirectConversationRequestSchema = z.object({
  params: resolveDirectConversationSchema,
});

export const getConversationHistoryRequestSchema = z.object({
  params: getConversationHistorySchema,
});
