import NextAuth, { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { readFromUsersSheet, ensureAdminUser } from "../../../utils/googleSheets"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await ensureAdminUser();
        const users = await readFromUsersSheet()
        const user = users.find(u => u.email === credentials.email)

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (session && session.user && token) {
        (session.user as User & { id: string, isAdmin: boolean }).id = token.sub as string;
        (session.user as User & { id: string, isAdmin: boolean }).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User & { isAdmin?: boolean } }): Promise<JWT> {
      if (user) {
        token.sub = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)

