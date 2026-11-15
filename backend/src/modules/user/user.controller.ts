import { Request, Response } from "express";
import { UserServices } from "./user.services.js";
import { AppError } from "@/utils/appError.js";
import { SearchUserType } from "./user.validation.js";

export const userDetails = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", 401);
  }

  const user = await UserServices.getUserDetails(userId);

  return res.status(200).json({
    success: true,
    message: "Details fetched successfully",
    data: user,
  });
};

export const searchUsers = async (req: Request, res: Response) => {
  const { username } = req.params as SearchUserType;
  const currentUserId = req.user?.userId;

  if (!currentUserId) {
    throw new AppError("UNAUTHORIZED", 401);
  }

  const user = await UserServices.searchUsers(username, currentUserId);

  const structuredUserResponse = user.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    conversationId: user.conversations_members?.[0]?.conversation_id ?? null,
  }));

  return res.status(200).json({
    success: true,
    message: "Users",
    data: structuredUserResponse,
  });
};
