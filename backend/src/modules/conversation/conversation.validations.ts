import z from "zod";

export const getConversationSchema = z.object({
  conversationId: z.string().trim().min(1, "Conversation ID is required"),
});

export const resolveDirectConversation = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export const getConversationRequestSchema = z.object({
  params: getConversationSchema,
});

export const resolveDirectConversationSchema = z.object({
  params: resolveDirectConversation,
});
