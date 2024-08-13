import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string, 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Log user and account for debugging
      console.log('Sign-in user:', user);
      console.log('Sign-in account:', account);

      if (!user.email) {
        console.error('No email found for user');
        return false; // Prevent sign-in if email is not present
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          const linkedAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account?.provider,
              providerAccountId: account?.providerAccountId,
            },
          });

          if (!linkedAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account?.provider!,
                providerAccountId: account?.providerAccountId!,
                type: account?.type!,
              },
            });
          }
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || '',
              image: user.image || '',
            },
          });

          await prisma.account.create({
            data: {
              userId: newUser.id,
              provider: account?.provider!,
              providerAccountId: account?.providerAccountId!,
              type: account?.type!,
            },
          });
        }
      } catch (error) {
        console.error('Error handling sign-in:', error);
        return false; // Prevent sign-in if there's an error
      }

      return true; // Allow sign-in
    },
  },
};
