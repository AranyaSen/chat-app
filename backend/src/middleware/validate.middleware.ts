import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const requestSchema = z.object({
  body: z.unknown().optional(),
  params: z.unknown().optional(),
  query: z.unknown().optional(),
});

export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const validated = result.data as z.infer<typeof requestSchema>;

    if (validated.body !== undefined) {
      req.body = validated.body;
    }

    if (validated.params !== undefined) {
      req.params = validated.params as Request["params"];
    }

    if (validated.query !== undefined) {
      req.query = validated.query as Request["query"];
    }

    next();
  };
};
