import type { RequestHandler } from "express";
import * as toolService from "../services/toolService.js";

export const listTools: RequestHandler = (_req, res, next) => {
  try {
    res.json({ success: true, data: toolService.listActiveTools() });
  } catch (e) {
    next(e);
  }
};

export const getTool: RequestHandler = (req, res, next) => {
  try {
    res.json({ success: true, data: toolService.getTool(req.params.id) });
  } catch (e) {
    next(e);
  }
};
