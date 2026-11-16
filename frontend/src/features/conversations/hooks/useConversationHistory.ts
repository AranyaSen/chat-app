import { useQuery } from "@tanstack/react-query";
import { conversationApi } from "@/features/conversations/api/conversation.api";
import type { UserSearchResult } from "@/features/user/types";

export function useConversationHistory(
  conversationId: string | null,
  selectedChatUser: UserSearchResult,
) {
  return useQuery({
    queryKey: ["conversations", conversationId, selectedChatUser, "history"],
    queryFn: () => conversationApi.history(conversationId as string),
    enabled: Boolean(conversationId && selectedChatUser),
  });
}
