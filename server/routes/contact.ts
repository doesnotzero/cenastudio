import { Router } from "express";
import * as contactController from "../controllers/contactController.js";
import { validateBody } from "../middleware/validate.js";
import { checkoutSchema, contactSchema, demoSchema } from "../schemas/contact.js";

export const contactRouter = Router();
contactRouter.post("/", validateBody(contactSchema), contactController.submitContact);
contactRouter.post("/demo", validateBody(demoSchema), contactController.submitDemo);

export const checkoutRouter = Router();
checkoutRouter.post("/start", validateBody(checkoutSchema), contactController.startCheckout);
