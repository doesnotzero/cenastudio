import { z } from "zod";

export const updateToolSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const createToolSchema = z.object({
  id: z.string().regex(/^(0[1-9]|1[0-2]|\d{2})$/),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
});

export type UpdateToolInput = z.infer<typeof updateToolSchema>;
export type CreateToolInput = z.infer<typeof createToolSchema>;
