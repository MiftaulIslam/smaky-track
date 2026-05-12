"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { cigaretteBrands, userSettings, users } from "@/src/db/schema";
import { updateProfileSchema, updateSettingsSchema } from "./schemas";

export type AccountActionResult =
  | { success: true }
  | { success: false; error: string };

const DEFAULT_TIMEZONE = "Asia/Dhaka";

function isValidTimeZone(value: string) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export async function syncUserTimezoneAction(timezone?: string): Promise<AccountActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const candidateTimezone =
    typeof timezone === "string" && timezone.trim().length > 0
      ? timezone.trim()
      : DEFAULT_TIMEZONE;
  const nextTimezone = isValidTimeZone(candidateTimezone)
    ? candidateTimezone
    : DEFAULT_TIMEZONE;

  const current = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });

  if (!current) {
    await db.insert(userSettings).values({
      userId,
      currency: "BDT",
      timezone: nextTimezone,
    });
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  }

  if (current.timezone === "UTC") {
    await db
      .update(userSettings)
      .set({ timezone: nextTimezone })
      .where(eq(userSettings.userId, userId));
    revalidatePath("/settings");
    revalidatePath("/dashboard");
  }

  return { success: true };
}

export async function updateSettingsAction(
  _: AccountActionResult | null,
  formData: FormData
): Promise<AccountActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = updateSettingsSchema.safeParse({
    currency: formData.get("currency"),
    timezone: formData.get("timezone"),
    dailyGoal: formData.get("dailyGoal"),
    reductionTargetPct: formData.get("reductionTargetPct"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  const nextValues = {
    currency: parsed.data.currency,
    timezone: parsed.data.timezone,
    dailyGoal: parsed.data.dailyGoal ?? null,
    reductionTargetPct: parsed.data.reductionTargetPct ?? null,
  };

  const existing = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });

  if (existing) {
    await db.update(userSettings).set(nextValues).where(eq(userSettings.userId, userId));
  } else {
    await db.insert(userSettings).values({ userId, ...nextValues });
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateProfileAction(
  _: AccountActionResult | null,
  formData: FormData
): Promise<AccountActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
    defaultBrandId: formData.get("defaultBrandId"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  await db
    .update(users)
    .set({
      name: parsed.data.name,
      image: parsed.data.image ?? null,
    })
    .where(eq(users.id, userId));

  if (parsed.data.defaultBrandId) {
    const brand = await db.query.cigaretteBrands.findFirst({
      where: eq(cigaretteBrands.id, parsed.data.defaultBrandId),
    });
    if (!brand) {
      return { success: false, error: "Selected default brand does not exist" };
    }
  }

  const currentSettings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });

  if (currentSettings) {
    await db
      .update(userSettings)
      .set({ defaultBrandId: parsed.data.defaultBrandId ?? null })
      .where(eq(userSettings.userId, userId));
  } else {
    await db.insert(userSettings).values({
      userId,
      currency: "BDT",
      timezone: "UTC",
      defaultBrandId: parsed.data.defaultBrandId ?? null,
    });
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: true };
}
