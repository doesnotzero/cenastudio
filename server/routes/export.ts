import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  exportProject,
  exportClient,
  exportAllClients,
  exportPipeline,
} from "../controllers/exportController.js";

const router = Router();

// All export routes require authentication
router.use(authenticate);

// Export project data
router.get("/projects/:id", exportProject);

// Export client data
router.get("/clients/:id", exportClient);
router.get("/clients", exportAllClients);

// Export pipeline data
router.get("/pipeline", exportPipeline);

export default router;
