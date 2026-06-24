import type { RequestHandler } from "express";
import {
  COOKIE_NAME,
  cookieOptions,
  signToken,
} from "../middleware/authenticate.js";
import * as authService from "../services/authService.js";

export const login: RequestHandler = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = authService.loginUser(email, password);
    const token = signToken(user);
    res.cookie(COOKIE_NAME, token, cookieOptions);
    res.json({ success: true, data: { user } });
  } catch (e) {
    next(e);
  }
};

export const register: RequestHandler = (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = authService.registerUser(name, email, password);
    const token = signToken(user);
    res.cookie(COOKIE_NAME, token, cookieOptions);
    res.status(201).json({ success: true, data: { user } });
  } catch (e) {
    next(e);
  }
};

export const forgotPassword: RequestHandler = (req, res, next) => {
  try {
    authService.createResetToken(req.body.email);
    res.json({
      success: true,
      data: { message: "Se o e-mail existir, você receberá as instruções." },
    });
  } catch (e) {
    next(e);
  }
};

export const resetPassword: RequestHandler = (req, res, next) => {
  try {
    authService.resetPassword(req.body.token, req.body.password);
    res.json({
      success: true,
      data: { message: "Senha redefinida com sucesso." },
    });
  } catch (e) {
    next(e);
  }
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ success: true, data: null });
};

export const me: RequestHandler = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const user = authService.getUserById(req.user.id);
    if (!user) {
      res.status(401).json({ success: false, error: "User not found" });
      return;
    }
    const planRow = authService.getUserPlan(req.user.id);
    const plan = authService.formatUserPlan(planRow);
    res.json({ success: true, data: { user, plan } });
  } catch (e) {
    next(e);
  }
};

export const githubCallback: RequestHandler = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const token = signToken(req.user);
    res.cookie(COOKIE_NAME, token, cookieOptions);
    res.redirect("/dashboard");
  } catch (e) {
    next(e);
  }
};
