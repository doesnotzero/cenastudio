import type { RequestHandler } from "express";
import { AppError } from "../middleware/errorHandler.js";
import * as stripeService from "../services/stripeService.js";

export const createSession: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const { planId } = req.body as { planId?: string };
    if (!planId || !["pro", "studio"].includes(planId)) {
      throw new AppError("Plano inválido.", 400);
    }

    const origin = req.headers.origin || process.env.CLIENT_ORIGIN || "http://localhost:5173";
    const session = await stripeService.createCheckoutSession(
      user.id,
      user.email,
      planId,
      `${origin}/success?plan=${planId}`,
      `${origin}/#pricing`,
    );

    res.json({ success: true, data: { url: session.url } });
  } catch (err) {
    next(err);
  }
};

export const createPortal: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const origin = req.headers.origin || process.env.CLIENT_ORIGIN || "http://localhost:5173";
    const session = await stripeService.createPortalSession(user.id, `${origin}/tools`);
    res.json({ success: true, data: { url: session.url } });
  } catch (err) {
    next(err);
  }
};

export const webhook: RequestHandler = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    if (!sig) {
      throw new AppError("Assinatura do webhook inválida.", 400);
    }
    await stripeService.handleWebhook(req.body as Buffer, sig);
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};
