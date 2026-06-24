import type { RequestHandler } from "express";
import { checkAndIncrementUsage } from "../services/authService.js";
import * as aiService from "../services/aiService.js";
import { db } from "../models/db.js";

export const generate: RequestHandler = async (req, res, next) => {
  try {
    const { toolId, input, projectId } = req.body;
    checkAndIncrementUsage(req.user!.id, toolId);
    const result = await aiService.generateForTool(req.user!.id, toolId, input, projectId);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
};

export const getHistory: RequestHandler = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const rows = db
      .prepare(
        "SELECT id, tool_id as toolId, input, output, created_at as createdAt FROM generations WHERE user_id = ? AND tool_id = ? ORDER BY id DESC LIMIT 20",
      )
      .all(req.user!.id, toolId);
    res.json({ success: true, data: rows });
  } catch (e) {
    next(e);
  }
};

