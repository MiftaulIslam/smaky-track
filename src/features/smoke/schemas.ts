import { z } from "zod";

export const logSmokeSchema = z.object({
  brandId: z.string().min(1, "Please select a brand"),
  smokedAt: z.coerce.date().optional(),
  note: z.string().max(200).optional(),
});

export const updateSmokeSchema = z.object({
  id: z.string().min(1),
  brandId: z.string().min(1),
  smokedAt: z.coerce.date(),
  note: z.string().max(200).optional(),
});

export type LogSmokeInput = z.infer<typeof logSmokeSchema>;
export type UpdateSmokeInput = z.infer<typeof updateSmokeSchema>;
