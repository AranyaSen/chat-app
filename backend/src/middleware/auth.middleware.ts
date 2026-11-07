import { verifyAccessToken } from "@/modules/auth/auth.utils.js";
import { Payload } from "@/types/express.js";
import { AppError } from "@/utils/appError.js";
import { NextFunction, Request, Response } from "express";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["chat-access-token"];

  if (!token) {
    throw new AppError("UNAUTHORIZED", 401);
  }

  const payload = await verifyAccessToken(token);

  req.user = payload as Payload;

  next();
};
