import { ConversationsRepo } from "./conversation.repo.js";
import { generateDirectKey } from "./conversation.utils.js";

export class ConversationsService {
  static async getUserChatsList(userId: string) {
    const conversations =
      await ConversationsRepo.getUserConversationsList(userId);

    if (!conversations) {
      return null;
    }
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
}
