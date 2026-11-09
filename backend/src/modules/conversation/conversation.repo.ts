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

  static async getConversationHistory(
    currentUserId: string,
    conversationId: string,
  ) {
    return prisma.messages.findMany({
      where: {
        conversation_id: conversationId,
        conversations: {
          conversation_members: {
            some: {
              user_id: currentUserId,
            },
          },
        },
      },
      orderBy: {
        sent_at: "desc",
      },
      select: {
        id: true,
        sender_id: true,
        sent_at: true,
        content: true,
        edited_at: true,
        deleted_at: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  static async createNewDirectConversation(
    senderId: string,
    receipentId: string,
    key: string,
  ) {
    const newConversation = await prisma.conversations.create({
      data: {
        direct_key: key,
        conversation_members: {
          create: [{ user_id: senderId }, { user_id: receipentId }],
        },
      },
      include: {
        conversation_members: true,
      },
    });
    return newConversation;
  }

  static async verifyConversationMember(
    senderId: string,
    conversationId: string,
  ) {
    return await prisma.conversation_Members.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: senderId,
        },
      },
    });
  }
}
