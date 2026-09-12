import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

export const INITIAL_ADMINS = (
  process.env.ADMIN_EMAILS ??
  "gasto@unaluka.com,tech@unaluka.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "database",
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret:
        process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  trustHost: true,

  events: {
    async signIn({ user }) {
      if (!user.id || !user.email) {
        return;
      }

      const email =
        user.email.toLowerCase();

      if (
        INITIAL_ADMINS.includes(email)
      ) {
        await prisma.user.update({
          where: {
            id: user.id,
          },

          data: {
            role: "ADMIN",
          },
        });
      }
    },

    async createUser({ user }) {
      if (!user.id || !user.email) {
        return;
      }

      const email =
        user.email.toLowerCase();

      const role =
        INITIAL_ADMINS.includes(email)
          ? "ADMIN"
          : "VIEWER";

      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          role,
        },
      });
    },
  },
});