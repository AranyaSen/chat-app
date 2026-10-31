import { Router } from "express";
import { validate } from "@/middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import {
  login,
  logout,
  refreshToken,
  register,
  verifyEmail,
} from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify-email", verifyEmail);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export const authRoutes = router;
