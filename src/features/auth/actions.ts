"use server";

import { signIn } from "@/src/auth";
import { db } from "@/src/db";
import { users, userSettings } from "@/src/db/schema";
import { signupSchema } from "./schemas";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function signupAction(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation error" };
  }

  const { name, email, password } = parsed.data;

  // Check if email already exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const [newUser] = await db
    .insert(users)
    .values({ name, email, hashedPassword })
    .returning({ id: users.id });

  // Create default settings
  await db.insert(userSettings).values({
    userId: newUser.id,
    currency: "BDT",
    timezone: "UTC",
  });

  // Sign in with credentials
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    // User was created — just send to login
    return { success: true };
  }
}

export async function loginAction(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (err) {
    if (err instanceof AuthError) {
      return { success: false, error: "Invalid email or password" };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
