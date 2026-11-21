import { pinoHttp } from "pino-http";
import { logger } from "@/config/logger.js";

export const httpLogger = pinoHttp({
  logger: logger,
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  customErrorMessage: (_req, _res, err) => {
    return `Request failed: ${err.message}`;
  },
  serializers: {
    req: (req) => ({
      requestId: req.id,
      method: req.method,
      url: req.url,
    }),

    res: (res) => ({
      statusCode: res.statusCode,
      responseTime: res.responseTime,
    }),
  },
});
