import { create } from "zustand";
import type { ConversationListItem } from "@/features/conversations/types";

type ConversationsStore = {
  conversations: ConversationListItem[];
  setConversations: (conversations: ConversationListItem[]) => void;
  updateLastMessage: (
    conversationId: string,
    lastMessage: ConversationListItem["lastMessage"],
  ) => void;
};

export const useConversationsStore = create<ConversationsStore>((set) => ({
  conversations: [],

  setConversations: (conversations) => set({ conversations }),

  updateLastMessage: (conversationId, lastMessage) =>
    set((state) => {
      const idx = state.conversations.findIndex(
        (c) => c.conversationId === conversationId,
      );
      if (idx === -1) return state;

      const updated = { ...state.conversations[idx], lastMessage };
      const rest = state.conversations.filter(
        (c) => c.conversationId !== conversationId,
      );
      return { conversations: [updated, ...rest] };
    }),
}));
