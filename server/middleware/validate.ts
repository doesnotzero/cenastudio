import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: result.error.issues.map((i) => i.message).join("; "),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
