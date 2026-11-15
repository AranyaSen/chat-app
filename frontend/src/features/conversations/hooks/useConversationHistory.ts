import { useQuery } from "@tanstack/react-query";
import { conversationApi } from "@/features/conversations/api/conversation.api";

export function useConversationHistory(conversationId: string | null) {
  return useQuery({
    queryKey: ["conversations", conversationId, "history"],
    queryFn: () => conversationApi.history(conversationId as string),
    enabled: Boolean(conversationId),
  });
}
