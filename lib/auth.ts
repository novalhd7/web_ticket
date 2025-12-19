// lib/auth.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { LoginScema } from "@/lib/zod";

// User tipe untuk NextAuth
interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string; // harus ada, tidak optional
  isActive: boolean; // harus ada, tidak optional
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/Login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
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

        // Pastikan semua properti wajib ada
        const sessionUser: SessionUser = {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          role: user.role ?? "user",
          isActive: user.isActive,
        };

        return sessionUser; // tidak ada any
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as SessionUser;
        token.id = u.id;
        token.role = u.role;
        token.isActive = u.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
