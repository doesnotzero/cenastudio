import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import * as notificationsController from "../controllers/notificationsController.js";

const router = Router();

router.use(authenticate);

router.get("/", notificationsController.listNotifications);
router.put("/:id/read", notificationsController.markAsRead);
router.put("/read-all", notificationsController.markAllAsRead);
router.get("/unread-count", notificationsController.getUnreadCount);

export default router;
