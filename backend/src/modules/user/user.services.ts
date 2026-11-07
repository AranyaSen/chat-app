import { AppError } from "@/utils/appError.js";
import { UserRepo } from "./user.repo.js";

export class UserServices {
  static async getUserDetails(userId: string) {
    const user = await UserRepo.getUserById(userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", 404);
    }
    return {
      ...user,
      is_logged_in: true,
    };
  }

  static async searchUsers(username: string) {
    const users = await UserRepo.searchUsers(username);
    return users;
  }
}
