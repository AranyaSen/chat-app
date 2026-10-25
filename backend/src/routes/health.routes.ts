import { Request, Response, Router } from "express";

const router = Router();

router.get("/healthz", (_: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
  });
});

export const healthRouter = router;
