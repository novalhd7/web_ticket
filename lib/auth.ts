// lib/auth.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { LoginScema } from "@/lib/zod";
import type { User } from "next-auth";

type Role = "USER" | "ADMIN";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/Login" },

  providers: [
    // ================= CREDENTIALS =================
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        const parsed = LoginScema.safeParse(credentials);
        if (!parsed.success) throw new Error("INVALID_INPUT");

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) throw new Error("USER_NOT_FOUND");
        if (!user.isActive) throw new Error("NOT_ACTIVATED");
        if (!user.password) throw new Error("OAUTH_ACCOUNT");

        const valid = await compare(parsed.data.password, user.password);
        if (!valid) throw new Error("INVALID_CREDENTIALS");

        // ✅ WAJIB return User (NextAuth)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
          isActive: user.isActive,
        };
      },
    }),

    // ================= GOOGLE =================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ================= JWT =================
    async jwt({ token, user }) {
      // Saat login pertama
      if (user?.email) {
        token.email = user.email;
      }

      // 🔥 PASTIKAN TOKEN SELALU PUNYA ROLE
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            role: true,
            isActive: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isActive = dbUser.isActive;
        }
      }

      return token;
    },

    // ================= SESSION =================
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
