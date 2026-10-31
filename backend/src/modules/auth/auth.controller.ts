import { Request, Response } from "express";
import { AuthService } from "./auth.services.js";
import { AppError } from "@/utils/appError.js";

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("chat-access-token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("chat-refresh-token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/auth/refresh",
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie("chat-access-token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  res.clearCookie("chat-refresh-token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/auth/refresh",
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  const user = await AuthService.register({
    name,
    username,
    email,
    password,
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const { user, accessToken, refreshToken } = await AuthService.login({
    username,
    password,
  });

  const message = user.is_verified ? "Login successful" : "Please verify email";

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(200).json({
    success: true,
    message: message,
    data: user,
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    throw new AppError("Token not provided", 400);
  }
  const user = await AuthService.verifyEmail({ req, token });
  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: user,
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["chat-refresh-token"];

  if (!refreshToken) {
    throw new AppError("Refresh token not found", 400);
  }

  const { newAccessToken, newRefreshToken } = await AuthService.refreshToken({
    refreshToken,
  });

  setAuthCookies(res, newAccessToken, newRefreshToken);

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
  });
};

export const logout = (req: Request, res: Response) => {
  clearAuthCookies(res);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
};
