"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import {
  clearAdminSessionCookie,
  clearFailedAttempts,
  getLockStatus,
  registerFailedAttempt,
  requireAdminAuth,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "./auth";

export type AdminActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
const updateUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  image: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    z.string().url("Image must be a valid URL").max(500).optional()
  ),
});

async function getRequestKey() {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for") ?? "unknown-ip";
  const userAgent = headerStore.get("user-agent") ?? "unknown-agent";
  return `${forwardedFor}::${userAgent}`;
}

export async function adminLoginAction(
  _: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const parsed = loginSchema.safeParse({
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  const requestKey = await getRequestKey();
  const lock = getLockStatus(requestKey);
  if (lock.locked) {
    const retryMinutes = Math.ceil(lock.retryAfterMs / (60 * 1000));
    return {
      success: false,
      error: `Too many attempts. Try again in ${retryMinutes} minute${retryMinutes === 1 ? "" : "s"}.`,
    };
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    registerFailedAttempt(requestKey);
    return { success: false, error: "Invalid admin password" };
  }

  clearFailedAttempts(requestKey);
  await setAdminSessionCookie();

  return { success: true };
}

export async function adminLogoutAction(): Promise<AdminActionResult> {
  await requireAdminAuth();
  await clearAdminSessionCookie();
  revalidatePath("/admin-dashboard");
  return { success: true, message: "Logged out" };
}

export async function updateAdminUserAction(
  userId: string,
  _: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  await requireAdminAuth();
  const parsed = updateUserSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!existingUser) return { success: false, error: "User not found" };

  await db
    .update(users)
    .set({
      name: parsed.data.name,
      image: parsed.data.image ?? null,
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin-dashboard");
  revalidatePath(`/admin-dashboard/users/${userId}`);
  revalidatePath("/profile");

  return { success: true, message: "User updated" };
}

export async function toggleBlacklistAction(
  userId: string,
  nextState: boolean,
  formData: FormData
): Promise<AdminActionResult> {
  await requireAdminAuth();

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!existingUser) return { success: false, error: "User not found" };

  const reason = (formData.get("reason") as string | null)?.trim();

  await db
    .update(users)
    .set({
      isBlacklisted: nextState,
      blacklistedAt: nextState ? new Date() : null,
      blacklistReason: nextState ? reason || "Blacklisted by admin" : null,
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin-dashboard");
  revalidatePath(`/admin-dashboard/users/${userId}`);
  revalidatePath("/dashboard");

  return {
    success: true,
    message: nextState ? "User has been blacklisted" : "User has been unblacklisted",
  };
}
