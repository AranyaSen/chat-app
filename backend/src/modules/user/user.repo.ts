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
}
