import { prisma } from "@/db/client.js";

export class UserRepo {
  static async getUserById(userId: string) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        user_id: true,
        username: true,
        name: true,
        email: true,
        is_active: true,
        is_verified: true,
        image: true,
      },
    });
    return user;
  }

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
    return await prisma.conversations.findUnique({
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
}
