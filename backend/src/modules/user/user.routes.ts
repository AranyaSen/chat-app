import { authenticate } from "@/middleware/auth.middleware.js";
import { Router } from "express";
import { searchUsers, userDetails } from "./user.controller.js";
import { searchUsersRequestSchema } from "./user.validation.js";
import { validate } from "@/middleware/validate.middleware.js";

const router = Router();

router.get("/details", authenticate, userDetails);
router.get(
  "/search",
  authenticate,
  validate(searchUsersRequestSchema),
  searchUsers,
);

export const userRoutes = router;
