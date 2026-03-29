import { type NextAuthOptions } from "next-auth";
import { getServerSession as nextAuthGetServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Strapi",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          const res = await axios.post(`${STRAPI_URL}/api/auth/local`, {
            identifier: credentials.identifier,
            password: credentials.password,
          });

          const { jwt, user } = res.data;

          if (!jwt || !user) {
            return null;
          }

          return {
            id: String(user.id),
            email: user.email,
            jwt,
            user_type: user.user_type,
            display_name: user.display_name || user.username,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.user_type = user.user_type;
        token.display_name = user.display_name;
      }
      return token;
    },

    async session({ session, token }) {
      session.jwt = token.jwt;
      session.user = {
        id: token.id,
        email: token.email as string,
        user_type: token.user_type,
        display_name: token.display_name,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}
