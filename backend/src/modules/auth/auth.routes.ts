import { Router } from "express";
import { validate } from "@/middleware/validate.middleware.js";
import {
  changeEmailRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
} from "./auth.validation.js";
import {
  changeEmail,
  login,
  logout,
  refreshToken,
  register,
  verifyEmail,
} from "./auth.controller.js";
import { authenticate } from "@/middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerRequestSchema), register);
router.post("/login", validate(loginRequestSchema), login);
router.get("/verify-email", verifyEmail);
router.post(
  "/change-email",
  authenticate,
  validate(changeEmailRequestSchema),
  changeEmail,
);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export const authRoutes = router;
