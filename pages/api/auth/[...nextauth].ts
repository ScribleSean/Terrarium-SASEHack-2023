import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import clientPromise from "../../../lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import { config } from "../../../lib/auth";

export default NextAuth(config);
