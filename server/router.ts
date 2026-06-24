import { Router } from "express";
import adminRoutes from "./routes/admin.js";
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import stripeCheckoutRoutes from "./routes/checkout.js";
import { checkoutRouter, contactRouter } from "./routes/contact.js";
import toolsRoutes from "./routes/tools.js";
import projectsRoutes from "./routes/projects.js";
import clientsRoutes from "./routes/clients.js";
import exportRoutes from "./routes/export.js";
import filesRoutes from "./routes/files.js";
import collaboratorsRoutes from "./routes/collaborators.js";
import analyticsRoutes from "./routes/analytics.js";
import projectMembersRoutes from "./routes/projectMembers.js";
import videoReviewsRoutes, { publicRouter as videoReviewsPublicRoutes } from "./routes/videoReviews.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tools", toolsRoutes);
router.use("/ai", aiRoutes);
router.use("/admin", adminRoutes);
router.use("/contact", contactRouter);
router.use("/checkout", checkoutRouter);
router.use("/checkout", stripeCheckoutRoutes);
router.use("/projects", projectsRoutes);
router.use("/clients", clientsRoutes);
router.use("/export", exportRoutes);
router.use("/files", filesRoutes);
router.use("/collaborators", collaboratorsRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/project-members", projectMembersRoutes);
router.use("/video-reviews", videoReviewsRoutes);
router.use("/public/video-reviews", videoReviewsPublicRoutes);

export default router;
