import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireOperationalPlan } from "../middleware/planAccess.js";
import {
  exportProject,
  exportClient,
  exportAllClients,
  exportPipeline,
  exportProjects,
  exportClients,
  exportOpportunities,
} from "../controllers/exportController.js";

const router = Router();

// All export routes require authentication
router.use(authenticate, requireOperationalPlan);

// Export project data
router.get("/projects/:id", exportProject);

// Export client data
router.get("/clients/:id", exportClient);
router.get("/clients", exportAllClients);

// Export pipeline data
router.get("/pipeline", exportPipeline);

// New advanced export routes (Excel, CSV, PDF)
router.get("/projects/:format(excel|csv|pdf)", exportProjects);
router.get("/clients/:format(excel|csv|pdf)", exportClients);
router.get("/opportunities/:format(excel|csv)", exportOpportunities);

export default router;
