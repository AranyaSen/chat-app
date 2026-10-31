import { Request, Response } from "express";
import { AuthService } from "./auth.services.js";

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
