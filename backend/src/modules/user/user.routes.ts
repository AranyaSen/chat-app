import { authenticate } from "@/middleware/auth.middleware.js";
import { Router } from "express";
import {
  chatsList,
  getConversationMembers,
  userDetails,
} from "./user.controller.js";
import { validate } from "@/middleware/validate.middleware.js";
import { getConversationRequestSchema } from "./user.validation.js";

const router = Router();

router.get("/details", authenticate, userDetails);
router.get("/chats", authenticate, chatsList);
router.get(
  "/get-conversation/:conversationId",
  authenticate,
  validate(getConversationRequestSchema),
  getConversationMembers,
);

export const userRoutes = router;
