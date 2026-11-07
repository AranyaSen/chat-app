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

  static async searchUsers(username: string) {
    return prisma.users.findMany({
      where: {
        username: username,
        is_active: true,
        is_verified: true,
      },
      select: {
        id: true,
        user_id: true,
      },
    });
  }
}
