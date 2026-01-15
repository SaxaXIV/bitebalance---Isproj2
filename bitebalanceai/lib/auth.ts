import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user, account }) {
      // For Google sign-in, ensure we have a DB user (our schema requires password).
      if (account?.provider === "google" && user?.email) {
        const existing = await prisma.user.findUnique({ where: { email: user.email } });
        if (existing) return true;

        const randomPassword = await bcrypt.hash(
          `google-${user.email}-${Date.now()}-${Math.random()}`,
          10
        );
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name ?? null,
            password: randomPassword,
          },
        });
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        // Always resolve to our DB user id
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser) token.id = dbUser.id;
      } else if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id as string;
      return session;
    },
  },
};

