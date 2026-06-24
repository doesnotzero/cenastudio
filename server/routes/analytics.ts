import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  getOverallAnalytics,
  getProjectAnalytics,
  getRevenueAnalytics,
  getActivityAnalytics,
} from "../controllers/analyticsController.js";

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// Get overall analytics
router.get("/overall", getOverallAnalytics);

// Get project-specific analytics
router.get("/projects/:id", getProjectAnalytics);

// Get revenue analytics
router.get("/revenue", getRevenueAnalytics);

// Get activity analytics
router.get("/activity", getActivityAnalytics);

export default router;
