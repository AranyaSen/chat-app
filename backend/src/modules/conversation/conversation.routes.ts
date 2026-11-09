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
  resolveDirectConversationSchema,
} from "./conversation.validations.js";

const router = Router();

router.get("/", authenticate, chatsList);
router.get(
  "/:conversationId",
  authenticate,
  validate(getConversationRequestSchema),
  getConversationMembers,
);
router.get(
  "/direct/:userId",
  authenticate,
  validate(resolveDirectConversationSchema),
  findDirectConversation,
);
router.get(
  "/history/:conversationId",
  authenticate,
  validate(getConversationHistoryRequestSchema),
  getConversationHistory,
);

export const conversationRoutes = router;
