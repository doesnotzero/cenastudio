import { Router } from "express";
import { getStudioSettings, updateStudioSettings } from "../controllers/studioSettingsController.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireOperationalPlan } from "../middleware/planAccess.js";

const router = Router();

router.use(authenticate, requireOperationalPlan);
router.get("/", getStudioSettings);
router.put("/", updateStudioSettings);

export default router;
