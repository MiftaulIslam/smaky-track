import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe auth config. Used by middleware only.
 * Does NOT import the DB adapter (Node runtime only).
 */
export const authConfig: NextAuthConfig = {
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

      const dashboardPaths = [
        "/dashboard",
        "/history",
        "/analytics",
        "/calendar",
        "/spending",
        "/brands",
        "/settings",
        "/profile",
      ];

      const isDashboard = dashboardPaths.some((p) => pathname.startsWith(p));

      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; // middleware will redirect to /login
      }

      return true;
    },
  },
};
