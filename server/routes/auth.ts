import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../schemas/auth.js";
import passport from "../config/passport.js";

const router = Router();

const registerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const forgotLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

router.post("/login", validateBody(loginSchema), authController.login);
router.post(
  "/register",
  registerLimiter,
  validateBody(registerSchema),
  authController.register,
);
router.post(
  "/forgot-password",
  forgotLimiter,
  validateBody(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post("/reset-password", validateBody(resetPasswordSchema), authController.resetPassword);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

// GitHub OAuth routes for admin login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  authController.githubCallback,
);

export default router;
