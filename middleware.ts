import NextAuth from "next-auth";
import { authConfig } from "@/src/auth/config";

const { auth } = NextAuth(authConfig);

/** Edge auth wrapper — must be a plain function export for Next.js 16 */
export default auth;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
