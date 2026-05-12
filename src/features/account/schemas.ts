import { z } from "zod";

const optionalNumber = (max: number) =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return value;
  }, z.coerce.number().int().positive().max(max)).optional();

export const updateSettingsSchema = z.object({
  currency: z.string().trim().min(2).max(10),
  timezone: z.string().trim().min(2).max(100),
  dailyGoal: optionalNumber(200),
  reductionTargetPct: optionalNumber(100),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  image: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return value;
  }, z.string().url().max(500).optional()),
  defaultBrandId: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return value;
  }, z.string().min(1).optional()),
});
