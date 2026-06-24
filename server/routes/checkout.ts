import { Router } from "express";
import * as checkoutController from "../controllers/checkoutController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/session", authenticate, checkoutController.createSession);
router.post("/portal", authenticate, checkoutController.createPortal);

export default router;
