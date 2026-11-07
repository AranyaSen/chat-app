import { authenticate } from "@/middleware/auth.middleware.js";
import { Router } from "express";
import { userDetails } from "./user.controller.js";

const router = Router();

router.get("/details", authenticate, userDetails);

export const userRoutes = router;
