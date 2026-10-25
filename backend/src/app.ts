import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.routes.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGINS?.split(","),
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use(healthRouter);

  return app;
};
