import { ConversationsRepo } from "./conversation.repo.js";
import { generateDirectKey } from "./conversation.utils.js";

export class ConversationsService {
  static async getUserChatsList(userId: string) {
    const conversations =
      await ConversationsRepo.getUserConversationsList(userId);

    return conversations;
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

    return conversationHistory;
  }
}
