import { Router } from "express";
import * as aiController from "../controllers/aiController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";
import { generateSchema } from "../schemas/ai.js";

const router = Router();

router.post("/generate", authenticate, validateBody(generateSchema), aiController.generate);
router.get("/history/:toolId", authenticate, aiController.getHistory);

export default router;
