import { Router } from "express";
import { createDemoProject, checkDemoProject } from "../controllers/demoController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// All demo routes require authentication
router.use(authenticate);

/**
 * POST /api/demo/create
 * Create demo client and project for onboarding
 */
router.post("/create", createDemoProject);

/**
 * GET /api/demo/check
 * Check if demo project already exists
 */
router.get("/check", checkDemoProject);

export default router;
