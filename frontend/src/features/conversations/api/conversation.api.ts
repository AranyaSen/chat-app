import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  ChatMessage,
  ConversationListItem,
} from "@/features/conversations/types";
import { api } from "@/lib/api";

export const conversationApi = {
  async list() {
    const response =
      await api.get<ApiResponse<ConversationListItem[]>>("/conversations");
    return response.data;
  },

  // async findDirect(userId: string) {
  //   const response = await api.get<ApiResponse<{ id: string } | null>>(
  //     `/conversations/direct/${encodeURIComponent(userId)}`,
  //   );
  //   return response.data;
  // },

  async history(conversationId: string) {
    const response = await api.get<ApiResponse<ChatMessage[]>>(
      `/conversations/history/${encodeURIComponent(conversationId)}`,
    );
    return response.data;
  },
};
