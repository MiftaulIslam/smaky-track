import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { accounts, sessions, users, verificationTokens } from "@/src/db/schema";
import { env } from "@/src/lib/env";
import { authConfig } from "./config";
import { loginSchema } from "../features/auth/schemas";

const ACCESS_TOKEN_MAX_AGE_SECONDS = env.AUTH_ACCESS_TOKEN_MAX_AGE_SECONDS;
const REFRESH_TOKEN_MAX_AGE_SECONDS = env.AUTH_REFRESH_TOKEN_MAX_AGE_SECONDS;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  },
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.hashedPassword) return null;

        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const mutableToken = token as typeof token & {
        id?: string;
        accessTokenExpiresAt?: number;
        refreshTokenExpiresAt?: number;
      };

      if (user) {
        mutableToken.id = user.id;
        mutableToken.accessTokenExpiresAt = nowSeconds + ACCESS_TOKEN_MAX_AGE_SECONDS;
        mutableToken.refreshTokenExpiresAt = nowSeconds + REFRESH_TOKEN_MAX_AGE_SECONDS;
      }

      if (!mutableToken.accessTokenExpiresAt) {
        mutableToken.accessTokenExpiresAt = nowSeconds + ACCESS_TOKEN_MAX_AGE_SECONDS;
      }

      if (!mutableToken.refreshTokenExpiresAt) {
        mutableToken.refreshTokenExpiresAt = nowSeconds + REFRESH_TOKEN_MAX_AGE_SECONDS;
      }

      if (nowSeconds > mutableToken.refreshTokenExpiresAt) {
        return {} as typeof token;
      }

      if (nowSeconds > mutableToken.accessTokenExpiresAt) {
        mutableToken.accessTokenExpiresAt = nowSeconds + ACCESS_TOKEN_MAX_AGE_SECONDS;
      }

      return mutableToken;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
