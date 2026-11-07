import { Request, Response } from "express";
import { UserServices } from "./user.services.js";
import { AppError } from "@/utils/appError.js";

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

export const chatsList = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const isActive = req.user?.isActive;
  const isVerified = req.user?.isVerified;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", 401);
  }

  if (!isActive) {
    throw new AppError("User is not active", 403);
  }

  if (!isVerified) {
    throw new AppError("User is not verified", 403);
  }

  const chatsList = await UserServices.getUserChatsList(userId);

  return res.status(200).json({
    success: true,
    message: "Chats list fetched successfully",
    data: chatsList,
  });
};

export const getConversationMembers = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const currentUserId = req.user?.userId;

  if (!currentUserId) {
    throw new AppError("UNAUTHORIZED", 401);
  }

  const conversationMembers = await UserServices.getConversationMembers(
    currentUserId,
    conversationId,
  );

  return res.status(200).json({
    success: true,
    message: "Conversation fetched successfully",
    data: conversationMembers,
  });
};
