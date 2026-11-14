import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.routes.js";
import { env } from "@/config/env.js";
import { authRoutes, conversationRoutes, userRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests, please try again",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const createApp = () => {
  const app = express();

  // CORS options
  app.use(
    cors({
      origin: env.CORS_ORIGINS.split(","),
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(globalRateLimiter);

  // Health routes
  app.use(healthRouter);

  // Api routes
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/conversations", conversationRoutes);

  // Global Error handler
  app.use(errorHandler);

  return app;
};
