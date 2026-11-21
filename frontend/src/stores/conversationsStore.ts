import { create } from "zustand";
import type { ConversationListItem } from "@/features/conversations/types";

type ConversationsStore = {
  conversations: ConversationListItem[];
  setConversations: (conversations: ConversationListItem[]) => void;
  conversationExists: (conversationId: string) => boolean;
  updateLastMessage: (
    conversationId: string,
    lastMessage: ConversationListItem["lastMessage"],
  ) => void;
};

export const useConversationsStore = create<ConversationsStore>((set, get) => ({
  conversations: [],

  setConversations: (conversations) => set({ conversations }),

  conversationExists: (conversationId) => {
    return get().conversations.some(
      (c: ConversationListItem) => c.conversationId === conversationId,
    );
  },

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
