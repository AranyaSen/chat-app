import { isDBHealthy } from "@/db/health.js";
import { Response, Router } from "express";

const router = Router();

router.get("/healthz", (_, res: Response) => {
  return res.status(200).json({
    status: "ok",
  });
});

router.get("/ready", async (_, res: Response) => {
  const isDbOk = await isDBHealthy();
  return res.status(isDbOk ? 200 : 503).json({
    status: isDbOk ? "ready" : "unavailable",
    checks: {
      db: isDbOk ? "ok" : "down",
    },
  });
});

export const healthRouter = router;
