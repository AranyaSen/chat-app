import { prisma } from "@/db/client.js";

export class ConversationsRepo {
  static async getUserConversationsList(userId: string) {
    const conversations = await prisma.conversation_Members.findMany({
      where: {
        user_id: userId,
      },
      select: {
        conversation: true,
      },
    });
    return conversations;
  }

  static async getConversationMembers(
    currentUserId: string,
    conversationId: string,
  ) {
    return await prisma.conversations.findFirst({
      where: {
        id: conversationId,
        conversation_members: {
          some: {
            id: currentUserId,
          },
        },
      },
      select: {
        id: true,
        type: true,
        conversation_members: {
          select: {
            user_id: true,
            user: true,
            role: true,
          },
        },
      },
    });
  }

  static async findDirectConversation(key: string) {
    return prisma.conversations.findFirst({
      where: {
        type: "DIRECT",
        direct_key: key,
      },
      select: {
        id: true,
      },
    });
  }
}
