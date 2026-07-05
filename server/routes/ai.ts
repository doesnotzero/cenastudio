import { Router } from "express";
import * as aiController from "../controllers/aiController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";
import { generateSchema } from "../schemas/ai.js";
import { requireOperationalPlan } from "../middleware/planAccess.js";

const router = Router();

router.use(authenticate, requireOperationalPlan);
router.post("/generate", validateBody(generateSchema), aiController.generate);
router.get("/history/:toolId", aiController.getHistory);

export default router;
