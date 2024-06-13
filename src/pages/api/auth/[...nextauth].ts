import NextAuth from "next-auth/next";
import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const nextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(
          process.env.NEXT_PUBLIC_STRAPI_API_URL + "/auth/local",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          }
        );
        
        const data = await res.json();

        if (!data.error) {
          return data;
        } else {
          throw new Error(data.error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: {
      token: JWT;
      user: User & { jwt?: string };
    }) {

      if (user) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }: {
      session: Session & { strapiAccessToken?: any };
      token: JWT;
    }) {

      // get user info from strapi
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/me?populate=anglerProfile.profilePicture`,
        {
          headers: {
            Authorization: `Bearer ${token.jwt}`,
          },
        },
      );
      const user = await res.json();
      // add user info to session
      session.user = user;
      session.strapiAccessToken = token.jwt;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthOptions;

export default NextAuth(nextAuthOptions);

export { nextAuthOptions };