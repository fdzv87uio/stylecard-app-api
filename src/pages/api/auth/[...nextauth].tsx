//@ts-ignore
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoose } from "@/utils/connectMongoose";
import User from "@/models/User";
import { compare } from "bcryptjs";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongoose().catch((error) => {
          throw new Error(error);
        });
        const currentUser: any = User.findOne({
          email: credentials?.email,
        }).select("+password");
        if (!currentUser) {
          throw new Error("Invalid Credentials");
        }
        const isPasswordCorrect = compare(
          credentials!.password,
          currentUser.password
        );
        if (!isPasswordCorrect) {
          throw new Error("Invalid Credentials");
        }
        return currentUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      const user: any = token.user;
      session.user = user;
      return session;
    },
  },
};

export default NextAuth(options);
