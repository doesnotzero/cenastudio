/**
 * Dashboard Routes
 *
 * Handles dashboard-related endpoints:
 * - GET /api/dashboard/stats - Workflow statistics
 * - GET /api/dashboard/finance-strip - Finance statistics
 * - GET /api/dashboard/user-info - User information
 */

import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getDashboardStats);

// GET /api/dashboard/finance-strip
router.get('/finance-strip', dashboardController.getFinanceStrip);

// GET /api/dashboard/user-info
router.get('/user-info', dashboardController.getUserInfo);

// GET /api/dashboard/jobs/active
router.get('/jobs/active', dashboardController.getActiveJobs);

export default router;
