import bcrypt from "bcryptjs";
import type {NextAuthConfig} from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "@auth/core/providers/credentials";

import {LoginSchema} from "@/schemas";
import {getUserByEmail} from "@/data/user";


export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
    authorize: async (credentials) => {
      const validateFields = LoginSchema.safeParse(credentials);

      if (validateFields.success) {
        const {email, password} = validateFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          return user;
        }

        return null;
      }

      return null;
    }
  })]
} satisfies NextAuthConfig;