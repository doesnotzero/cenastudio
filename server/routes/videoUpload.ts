import express from "express";
import { uploadVideo } from "../controllers/videoUploadController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload video
router.post("/upload", uploadVideo);

export default router;
