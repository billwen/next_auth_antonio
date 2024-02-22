import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {db} from "@/lib/db";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {getUserById} from "@/data/user";

export const {
  handlers: {GET, POST},
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt"},
  callbacks: {
    signIn: async ({user, account, profile}) => {
      return true;
    },
    session: async ({session, token}) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      console.log({session});
      return session;
    },

    jwt: async ({token, user, account, profile, isNewUser}) => {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.role = existingUser.role;
      }

      return token;
    }
  },
  ...authConfig
});
