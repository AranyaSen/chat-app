import { decryptMessage } from "@/utils/encryption.js";
import { ConversationsRepo } from "./conversation.repo.js";
import { generateDirectKey } from "./conversation.utils.js";

export class ConversationsService {
  static async getUserChatsList(userId: string) {
    const conversations =
      await ConversationsRepo.getUserConversationsList(userId);

    const conversationList = conversations.map((conversation) => ({
      conversationId:
        conversation.conversation.conversation_members?.[0]?.conversation_id ??
        null,
      user: conversation.conversation.conversation_members?.[0]?.user ?? null,
      lastMessage:
        conversation.conversation.messages?.map((message) => ({
          ...message,
          content: decryptMessage(message.content),
        })) ?? null,
    }));

    return conversationList;
  }

  static async getConversationMembers(
    currentUserId: string,
    conversationId: string,
  ) {
    const conversationMembers = await ConversationsRepo.getConversationMembers(
      currentUserId,
      conversationId,
    );
    return conversationMembers;
  }

  static async findDirectConversation(currentUserId: string, userId: string) {
    const key = generateDirectKey(currentUserId, userId);

    const conversationId = await ConversationsRepo.findDirectConversation(key);

    return conversationId;
  }

  static async getConversationHitory(
    currentUserId: string,
    conversationId: string,
  ) {
    const conversationHistory = await ConversationsRepo.getConversationHistory(
      currentUserId,
      conversationId,
    );
    const structuredConversationHistory = conversationHistory.map(
      (conversation) => ({
        ...conversation,
        user: conversation.user.username,
      }),
    );
    return structuredConversationHistory;
  }
}
