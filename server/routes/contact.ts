import { Router } from "express";
import * as contactController from "../controllers/contactController.js";
import { validateBody } from "../middleware/validate.js";
import { contactSchema, demoSchema } from "../schemas/contact.js";

export const contactRouter = Router();
contactRouter.post("/", validateBody(contactSchema), contactController.submitContact);
contactRouter.post("/demo", validateBody(demoSchema), contactController.submitDemo);
