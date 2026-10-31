import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.routes.js";
import { env } from "@/config/env.js";
import { authRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

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

  // Health routes
  app.use(healthRouter);

  // Auth routes
  app.use("/auth", authRoutes);

  // Global Error handler
  app.use(errorHandler);

  return app;
};
