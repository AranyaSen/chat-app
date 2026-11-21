import { updateEmailTokenHash } from "@/modules/auth/auth.repo.js";
import { generateEmailToken } from "./emailToken.js";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { transporter } from "./transporter.js";
import nodemailer from "nodemailer";
import { AppError } from "./appError.js";

type User = {
  email: string;
  id: string;
  name: string;
  username: string;
  is_verified: boolean;
};

export const sendEmail = async (user: User) => {
  const { hashedToken, token } = generateEmailToken();
  const verificationLink = `${env.EMAIL_VERIFICATION_LINK}?token=${token}`;

  await updateEmailTokenHash({ userEmail: user.email, hashedToken });

  logger.info({ userId: user.id }, "Sending verification email");

  try {
    const message = await transporter.sendMail({
      from: "Chat App <no-reply@test.chatapp.dev>",
      to: user.email,
      subject: "Verify your Email Address",
      html: `
                <h1>Welcome ${user.username}!</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">Verify Email</a>`,
    });
    const previewUrl = nodemailer.getTestMessageUrl(message);
    logger.info(
      { userId: user.id, messageId: message.messageId, previewUrl },
      "Verification email sent",
    );
    return {
      user: user,
      previewUrl,
    };
  } catch (error) {
    logger.error(
      { err: error, userId: user.id },
      "Failed to send verification email",
    );
    throw new AppError("Failed to send verification email", 500);
  }
};
