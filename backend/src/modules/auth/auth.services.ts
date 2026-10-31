import { hashPassword } from "@/utils/password.js";
import { createUser, findUserByUsernameOrEmail } from "./auth.repo.js";
import { RegisterType } from "./auth.validation.js";
import { AppError } from "@/utils/appError.js";

export class AuthService {
  static async register(data: RegisterType) {
    const userExists = await findUserByUsernameOrEmail({
      username: data.username,
      email: data.email,
    });

    if (userExists) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await createUser({
      name: data.name,
      username: data.username,
      email: data.email,
      hashedPassword,
    });

    return user;
  }
}
