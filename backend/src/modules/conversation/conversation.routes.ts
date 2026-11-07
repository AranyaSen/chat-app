import { authenticate } from "@/middleware/auth.middleware.js";
import { Router } from "express";
import { validate } from "@/middleware/validate.middleware.js";
import {
  chatsList,
  getConversationMembers,
  findDirectConversation,
} from "./conversation.controller.js";
import {
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

export const conversationRoutes = router;
