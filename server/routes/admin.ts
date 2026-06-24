import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";
import { createToolSchema, updateToolSchema } from "../schemas/admin.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/tools", adminController.listTools);
router.post("/tools", validateBody(createToolSchema), adminController.createTool);
router.put("/tools/:id", validateBody(updateToolSchema), adminController.updateTool);
router.delete("/tools/:id", adminController.deleteTool);
router.get("/users", adminController.listUsers);

export default router;
