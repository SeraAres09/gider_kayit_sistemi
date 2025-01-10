import NextAuth, { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import { readFromUsersSheet } from "../../../utils/googleSheets"

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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session?.user) {
        (session.user as User & { id: string; isAdmin: boolean }).id = token.sub;
        (session.user as User & { id: string; isAdmin: boolean }).isAdmin = token.isAdmin as boolean;
      } else {
        console.warn("Session user is not defined");
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)

