import { z } from "zod";

export const generateSchema = z.object({
  toolId: z.string().regex(/^(0[1-9]|1[0-2])$/),
  input: z.record(z.string(), z.string()).default({}),
});

export type GenerateInput = z.infer<typeof generateSchema>;
