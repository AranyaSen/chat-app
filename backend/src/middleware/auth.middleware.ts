import { verifyAccessToken } from "@/modules/auth/auth.utils.js";
import { Payload } from "@/types/express.js";
import { AppError } from "@/utils/appError.js";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["chat-access-token"];

  if (!token) {
    throw new AppError("Unauthorised access", 401);
  }

  const payload = await verifyAccessToken(token);

  req.user = payload as unknown as Payload;

  next();
};
