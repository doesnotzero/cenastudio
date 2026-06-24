import { Router } from "express";
import * as projectsController from "../controllers/projectsController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/", authenticate, projectsController.listProjects);
router.get("/activity", authenticate, projectsController.getRecentActivities);
router.post("/", authenticate, projectsController.createProject);
router.get("/:id", authenticate, projectsController.getProject);
router.put("/:id", authenticate, projectsController.updateProject);
router.delete("/:id", authenticate, projectsController.deleteProject);
router.get("/:id/states", authenticate, projectsController.listProjectStates);
router.post("/:id/state", authenticate, projectsController.saveToolState);
router.get("/:id/state/:toolId", authenticate, projectsController.getToolState);

export default router;
