import type { RequestHandler } from "express";
import * as authService from "../services/authService.js";
import * as toolService from "../services/toolService.js";

export const listTools: RequestHandler = (_req, res, next) => {
  try {
    res.json({ success: true, data: toolService.listAllTools() });
  } catch (e) {
    next(e);
  }
};

export const updateTool: RequestHandler = (req, res, next) => {
  try {
    res.json({ success: true, data: toolService.updateTool(req.params.id, req.body) });
  } catch (e) {
    next(e);
  }
};

export const createTool: RequestHandler = (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: toolService.createTool(req.body) });
  } catch (e) {
    next(e);
  }
};

export const deleteTool: RequestHandler = (req, res, next) => {
  try {
    res.json({ success: true, data: toolService.softDeleteTool(req.params.id) });
  } catch (e) {
    next(e);
  }
};

export const listUsers: RequestHandler = (_req, res, next) => {
  try {
    res.json({
      success: true,
      data: { count: authService.countUsers(), online: authService.countUsers() },
    });
  } catch (e) {
    next(e);
  }
};
