import { z } from "zod";

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AUTH_ACCESS_TOKEN_MAX_AGE_SECONDS: z.coerce.number().int().positive(),
    AUTH_REFRESH_TOKEN_MAX_AGE_SECONDS: z.coerce.number().int().positive(),
    ADMIN_DASHBOARD_PASSWORD: z.string().min(6),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  })
  .superRefine((value, ctx) => {
    if (value.AUTH_REFRESH_TOKEN_MAX_AGE_SECONDS <= value.AUTH_ACCESS_TOKEN_MAX_AGE_SECONDS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["AUTH_REFRESH_TOKEN_MAX_AGE_SECONDS"],
        message: "AUTH_REFRESH_TOKEN_MAX_AGE_SECONDS must be greater than AUTH_ACCESS_TOKEN_MAX_AGE_SECONDS",
      });
    }
  });

function getEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten());
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

export const env = getEnv();
