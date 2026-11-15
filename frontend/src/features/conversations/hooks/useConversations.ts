import { useQuery } from "@tanstack/react-query";
import { conversationApi } from "@/features/conversations/api/conversation.api";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: conversationApi.list,
  });
}
