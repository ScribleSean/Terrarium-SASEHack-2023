import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import client from "../../../lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        (await client).db().collection("users").insertOne({
          id: "id",
          name: "test",
          email: "test@test",
        });
        // // You need to provide your own logic here that takes the credentials
        // // submitted and returns either a object representing a user or value
        // // that is false/null if the credentials are invalid.
        // // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // // You can also use the `req` object to obtain additional parameters
        // // (i.e., the request IP address)
        // const res = await fetch("/your/endpoint", {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" },
        // });
        // const user = await res.json();

        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user;
        // }
        // // Return null if user data could not be retrieved

        return { id: "id", name: "test", email: "test@test" };
      },
    }),
  ],
};

export default NextAuth(authOptions);
