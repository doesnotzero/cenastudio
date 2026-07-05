import { Router } from "express";
import * as projectsController from "../controllers/projectsController.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireOperationalPlan } from "../middleware/planAccess.js";

const router = Router();

router.use(authenticate, requireOperationalPlan);
router.get("/", projectsController.listProjects);
router.get("/activity", projectsController.getRecentActivities);
router.post("/", projectsController.createProject);
router.get("/:id", projectsController.getProject);
router.put("/:id", projectsController.updateProject);
router.delete("/:id", projectsController.deleteProject);
router.get("/:id/states", projectsController.listProjectStates);
router.post("/:id/state", projectsController.saveToolState);
router.get("/:id/state/:toolId", projectsController.getToolState);

export default router;
