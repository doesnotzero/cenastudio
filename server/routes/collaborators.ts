import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireOperationalPlan } from "../middleware/planAccess.js";
import {
  listCollaborators,
  getCollaborator,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
  getCollaboratorStats,
} from "../controllers/collaboratorsController.js";

const router = Router();

// All collaborator routes require authentication
router.use(authenticate, requireOperationalPlan);

// List collaborators
router.get("/", listCollaborators);

// Get collaborator statistics
router.get("/stats", getCollaboratorStats);

// Get specific collaborator
router.get("/:id", getCollaborator);

// Create collaborator
router.post("/", createCollaborator);

// Update collaborator
router.put("/:id", updateCollaborator);

// Delete collaborator
router.delete("/:id", deleteCollaborator);

export default router;
