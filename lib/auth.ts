import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@company" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null; // Return null if credentials are missing
        }
        try {
          const client = await clientPromise;
          const usersCollection = client.db().collection("users");

          // Check if a user with the provided username already exists
          const existingUser = await usersCollection.findOne({
            email: credentials.email,
          });

          if (!existingUser || existingUser.password !== credentials.password) {
            return null;
          }

          // Return the newly created user
          return {
            id: existingUser._id.toString(),
            name: existingUser.name,
            imageUrl: existingUser.imageUrl,
            isOrg: existingUser.isOrg,
            email: credentials.email,
            password: credentials.password,
          };
        } catch (error) {
          return null; // Something went wrong, return null
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          name: token.name as string,
          imageUrl: token.imageUrl as string,
          email: token.email as string,
          isOrg: token.isOrg as boolean,
        },
      };
    },
    jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }

      return token;
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
