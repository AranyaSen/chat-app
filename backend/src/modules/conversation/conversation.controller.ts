import { AppError } from "@/utils/appError.js";
import { Request, Response } from "express";
import { ConversationsService } from "./conversation.services.js";

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

  const chatsList = await ConversationsService.getUserChatsList(userId);

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

  const conversationMembers = await ConversationsService.getConversationMembers(
    currentUserId,
    conversationId,
  );

  return res.status(200).json({
    success: true,
    message: "Conversation fetched successfully",
    data: conversationMembers,
  });
};

export const findDirectConversation = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const currentUserId = req.user?.userId;

  if (!currentUserId) {
    throw new AppError("UNAUTHORIZED", 401);
  }

  const conversationId = await ConversationsService.findDirectConversation(
    currentUserId,
    userId,
  );

  return res.status(200).json({
    success: true,
    message: "Conversation fetched successfully",
    data: conversationId,
  });
};

export const getConversationHistory = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const currentUserId = req.user?.userId;

  if (!currentUserId) {
    throw new AppError("UNAUTHORIZED", 401);
  }

  const converationHistory = await ConversationsService.getConversationHitory(
    currentUserId,
    conversationId,
  );

  return res.status(200).json({
    success: true,
    message: "Conversation history fetched successfully",
    data: converationHistory,
  });
};
