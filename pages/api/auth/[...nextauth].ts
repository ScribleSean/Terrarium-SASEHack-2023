import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import clientPromise from "../../../lib/mongodb";



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@company" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return Promise.resolve(null); // Return null if credentials are missing
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

          // valid credentials insert the new user
          const result = await usersCollection.insertOne({
            email: credentials.email,
            password:credentials.password
          });

          // Return the newly created user
          return{
            id: result.insertedId.toString(),
            email: credentials.email,
            password: credentials.password,
          };
        } catch (error) {
          return Promise.resolve(null); // Something went wrong, return null
        }
      },
    }),
  ],
};
export default NextAuth(authOptions);

