import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/src/lib/env";

export const ADMIN_COOKIE_NAME = "smaky_admin_session";
const ADMIN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours
const ADMIN_LOCKOUT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ADMIN_MAX_ATTEMPTS = 5;

type LoginAttempt = {
  count: number;
  lockedUntil: number | null;
};

const attempts = new Map<string, LoginAttempt>();

function sign(value: string) {
  return createHmac("sha256", env.AUTH_SECRET).update(value).digest("hex");
}

function buildPayload(expiresAt: number) {
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

function parsePayload(raw: string) {
  const [expiresAtRaw, signature] = raw.split(".");
  if (!expiresAtRaw || !signature) return null;

  const expected = sign(expiresAtRaw);
  const validSignature = timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expected, "utf8")
  );
  if (!validSignature) return null;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt)) return null;

  return { expiresAt };
}

export function verifyAdminPassword(input: string) {
  return input === env.ADMIN_DASHBOARD_PASSWORD;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  const payload = parsePayload(token);
  if (!payload) return false;

  return Date.now() < payload.expiresAt;
}

export async function requireAdminAuth() {
  const authorized = await isAdminAuthenticated();
  if (!authorized) redirect("/admin-dashboard/login");
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + ADMIN_COOKIE_MAX_AGE_SECONDS * 1000;
  cookieStore.set(ADMIN_COOKIE_NAME, buildPayload(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/admin-dashboard",
    maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function getLockStatus(key: string) {
  const entry = attempts.get(key);
  if (!entry?.lockedUntil) return { locked: false, retryAfterMs: 0 };
  const retryAfterMs = entry.lockedUntil - Date.now();
  if (retryAfterMs <= 0) {
    attempts.delete(key);
    return { locked: false, retryAfterMs: 0 };
  }
  return { locked: true, retryAfterMs };
}

export function registerFailedAttempt(key: string) {
  const current = attempts.get(key) ?? { count: 0, lockedUntil: null };
  const nextCount = current.count + 1;
  if (nextCount >= ADMIN_MAX_ATTEMPTS) {
    attempts.set(key, { count: nextCount, lockedUntil: Date.now() + ADMIN_LOCKOUT_WINDOW_MS });
    return;
  }
  attempts.set(key, { count: nextCount, lockedUntil: null });
}

export function clearFailedAttempts(key: string) {
  attempts.delete(key);
}
