import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { conversationApi } from "@/features/conversations/api/conversation.api";
import { useConversationsStore } from "@/stores/conversationsStore";

export function useConversations() {
  const setConversations = useConversationsStore((s) => s.setConversations);

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: conversationApi.list,
  });

  useEffect(() => {
    if (query.data?.data) {
      setConversations(query.data.data);
    }
  }, [query.data, setConversations]);

  return query;
}
