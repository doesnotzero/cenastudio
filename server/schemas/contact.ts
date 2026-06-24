import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  type: z.enum(["contact", "demo", "support"]).default("contact"),
});

export const checkoutSchema = z.object({
  planId: z.enum(["iniciante", "profissional", "produtora"]),
  fullName: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export const demoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
