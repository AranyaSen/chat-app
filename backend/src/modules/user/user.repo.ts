import { prisma } from "@/db/client.js";

export class UserRepo {
  static async getUserById(userId: string) {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
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

  static async searchUsers(username: string, currentUserId: string) {
    return prisma.users.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        username: {
          contains: username,
          mode: "insensitive",
        },
        is_active: true,
        is_verified: true,
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        conversations_members: {
          select: {
            conversation_id: true,
          },
        },
      },
    });
  }
}
