import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret:
    process.env.AUTH_SECRET || "fallback-secret-for-testing-only-not-secure",
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {},
} satisfies NextAuthConfig;
