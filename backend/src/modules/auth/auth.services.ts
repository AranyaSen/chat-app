import { hashPassword, verifyPassword } from "@/utils/password.js";
import {
  createUser,
  findUserByEmailToken,
  findUserByUsernameOrEmail,
  updateUserVerifiedStatus,
} from "./auth.repo.js";
import { LoginType, RegisterType } from "./auth.validation.js";
import { AppError } from "@/utils/appError.js";
import { createHashedToken, generateEmailToken } from "@/utils/emailToken.js";
import { transporter } from "@/utils/transporter.js";
import { env } from "@/config/env.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./auth.utils.js";
import { Request } from "express";

export class AuthService {
  static async register(data: RegisterType) {
    const userExists = await findUserByUsernameOrEmail({
      username: data.username,
      email: data.email,
    });

    if (userExists) {
      throw new AppError("User already exists please try login", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const hashedToken = generateEmailToken();

    const user = await createUser({
      name: data.name,
      username: data.username,
      email: data.email,
      hashedPassword,
      hashedToken,
    });

    return user;
  }

  static async login(data: LoginType) {
    const user = await findUserByUsernameOrEmail({ username: data.username });

    if (!user) {
      throw new AppError("Invalid username or password", 401);
    }

    const passwordMatches = await verifyPassword(
      user.password_hash,
      data.password,
    );
    if (!passwordMatches) {
      throw new AppError("Invalid username or password", 401);
    }

    if (!user.is_verified) {
      const verificationLink = `${env.EMAIL_VERIFICATION_LINK}?token=${user.email_token_hash}`;

      await transporter.sendMail({
        from: "Chat-app",
        to: user.email,
        subject: "Verify your Email Address",
        html: `
          <h1>Welcome ${user.username}!</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">Verify Email</a>`,
      });
    }

    const payload = {
      username: user.username,
      userId: user.id,
      isActive: user.is_active,
      isVerified: user.is_verified,
      role: user.role,
    };
    const accessToken = await generateAccessToken(payload);

    const refreshToken = await generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }

  static async verifyEmail({ req, token }: { req: Request; token: string }) {
    const hashedToken = createHashedToken(token);

    const user = await findUserByEmailToken(hashedToken);

    if (!user) {
      throw new AppError("Invalid token", 400);
    }

    await updateUserVerifiedStatus(user.id);

    return user;
  }

  static async refreshToken({ refreshToken }: { refreshToken: string }) {
    const verifiedPayload = await verifyRefreshToken(refreshToken);

    if (!verifiedPayload) {
      throw new AppError("Invalid access token", 401);
    }
    const payload = {
      username: verifiedPayload.username,
      userId: verifiedPayload.userId,
      isActive: verifiedPayload.isActive,
      isVerified: verifiedPayload.isVerified,
      role: verifiedPayload.role,
    };

    const newAccessToken = await generateAccessToken(payload);
    const newRefreshToken = await generateRefreshToken(payload);

    return { newAccessToken, newRefreshToken };
  }
}
