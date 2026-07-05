import { Router } from "express";
import * as toolsController from "../controllers/toolsController.js";

const router = Router();

router.get("/", toolsController.listTools);
router.get("/:id", toolsController.getTool);

export default router;
