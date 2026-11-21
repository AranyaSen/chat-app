import { logger } from "@/config/logger.js";
import { AppError } from "@/utils/appError.js";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  const message =
    err instanceof AppError ? err.message : "Internal Server Error";

  if (err instanceof AppError) {
    logger.warn(
      {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode,
        err,
      },
      "Client error",
    );
  } else {
    logger.error(
      {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode,
        err,
      },
      "Unhandled server error",
    );
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
