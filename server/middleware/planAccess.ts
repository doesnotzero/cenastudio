import type { RequestHandler } from "express";
import { AppError } from "./errorHandler.js";
import { requireOperationalAccess } from "../services/entitlementService.js";

export const requireOperationalPlan: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    await requireOperationalAccess(req.user.id, req.user.role);
    next();
  } catch (error) {
    next(error);
  }
};
