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
  const { username } = req.query as SearchUserType;

  const user = await UserServices.searchUsers(username);

  return res.status(200).json({
    success: true,
    message: "Users",
    data: user,
  });
};
