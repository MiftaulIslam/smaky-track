"use server";

import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { smokeEntries, cigaretteBrands } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logSmokeSchema, updateSmokeSchema } from "./schemas";

export type SmokeActionResult =
  | { success: true; id?: string }
  | { success: false; error: string };

export async function logSmokeAction(
  brandId: string,
  smokedAt?: Date
): Promise<SmokeActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = logSmokeSchema.safeParse({ brandId, smokedAt });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  const brand = await db.query.cigaretteBrands.findFirst({
    where: eq(cigaretteBrands.id, parsed.data.brandId),
  });

  if (!brand) return { success: false, error: "Brand not found" };

  const [entry] = await db
    .insert(smokeEntries)
    .values({
      userId: session.user.id,
      brandId: brand.id,
      smokedAt: parsed.data.smokedAt ?? new Date(),
      priceMinor: brand.defaultPriceMinor,
      currency: brand.currency,
    })
    .returning({ id: smokeEntries.id });

  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/analytics");
  revalidatePath("/calendar");
  revalidatePath("/spending");
  revalidatePath("/brands");

  return { success: true, id: entry.id };
}

export async function deleteSmokeAction(entryId: string): Promise<SmokeActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const entry = await db.query.smokeEntries.findFirst({
    where: and(
      eq(smokeEntries.id, entryId),
      eq(smokeEntries.userId, session.user.id)
    ),
  });

  if (!entry) return { success: false, error: "Entry not found" };

  await db
    .delete(smokeEntries)
    .where(
      and(eq(smokeEntries.id, entryId), eq(smokeEntries.userId, session.user.id))
    );

  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/analytics");
  revalidatePath("/calendar");
  revalidatePath("/spending");
  revalidatePath("/brands");

  return { success: true };
}

export async function updateSmokeAction(
  input: { id: string; brandId: string; smokedAt: Date; note?: string }
): Promise<SmokeActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = updateSmokeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  const entry = await db.query.smokeEntries.findFirst({
    where: and(
      eq(smokeEntries.id, parsed.data.id),
      eq(smokeEntries.userId, session.user.id)
    ),
  });
  if (!entry) return { success: false, error: "Entry not found" };

  const brand = await db.query.cigaretteBrands.findFirst({
    where: eq(cigaretteBrands.id, parsed.data.brandId),
  });
  if (!brand) return { success: false, error: "Brand not found" };

  await db
    .update(smokeEntries)
    .set({
      brandId: parsed.data.brandId,
      smokedAt: parsed.data.smokedAt,
      priceMinor: brand.defaultPriceMinor,
      note: parsed.data.note ?? null,
    })
    .where(
      and(eq(smokeEntries.id, parsed.data.id), eq(smokeEntries.userId, session.user.id))
    );

  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/analytics");
  revalidatePath("/calendar");
  revalidatePath("/spending");
  revalidatePath("/brands");

  return { success: true };
}
