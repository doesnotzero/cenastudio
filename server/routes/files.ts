import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireOperationalPlan } from "../middleware/planAccess.js";
import {
  listFiles,
  uploadFile,
  deleteFile,
  getFile,
  downloadFile,
} from "../controllers/filesController.js";

const router = Router();

// All file routes require authentication
router.use(authenticate, requireOperationalPlan);

// List files for a project
router.get("/projects/:projectId", listFiles);

// Upload a file
router.post("/upload", uploadFile);

// Get file info
router.get("/:id", getFile);

// Download file
router.get("/:id/download", downloadFile);

// Delete a file
router.delete("/:id", deleteFile);

export default router;
