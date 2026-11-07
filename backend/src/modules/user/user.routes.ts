import { authenticate } from "@/middleware/auth.middleware.js";
import { Router } from "express";
import { chatsList, userDetails } from "./user.controller.js";

const router = Router();

router.get("/details", authenticate, userDetails);
router.get("/chats", authenticate, chatsList);

export const userRoutes = router;
