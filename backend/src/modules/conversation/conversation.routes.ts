import { authenticate } from "@/middleware/auth.middleware.js";
import { Router } from "express";
import { validate } from "@/middleware/validate.middleware.js";
import {
  chatsList,
  getConversationMembers,
  findDirectConversation,
  getConversationHistory,
} from "./conversation.controller.js";
import {
  getConversationHistoryRequestSchema,
  getConversationRequestSchema,
  resolveDirectConversationRequestSchema,
} from "./conversation.validations.js";

const router = Router();

router.get("/", authenticate, chatsList);
router.get(
  "/direct/:userId",
  authenticate,
  validate(resolveDirectConversationRequestSchema),
  findDirectConversation,
);
router.get(
  "/history/:conversationId",
  authenticate,
  validate(getConversationHistoryRequestSchema),
  getConversationHistory,
);
router.get(
  "/:conversationId",
  authenticate,
  validate(getConversationRequestSchema),
  getConversationMembers,
);

export const conversationRoutes = router;
