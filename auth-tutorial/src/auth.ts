import NextAuth, {type DefaultSession} from "next-auth";
import authConfig from "@/auth.config";
import {PrismaAdapter} from "@auth/prisma-adapter";

import {db} from "@/lib/db";
import {getUserById} from "@/data/user";
import {UserRole} from "@prisma/client";
import {getTwoFactorConfirmationByUserId} from "@/data/two-factor-confirmation";
import {getAccountByUserId} from "@/data/account";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

// declare module "@auth/core" {
//   /**
//    * Returned by 'useSession', 'getSession' and received as 'session' on API routes
//    */
//   interface Session {
//     user: {
//       /** The user's postal address. */
//       role: string;
//       // By defaults, Typescript merges new interface properties with the default ones
//     } & DefaultSession["user"]; // To keep the default fields
//   }
// }

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: UserRole;
  }
}

export const {
  handlers: {GET, POST},
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt"},
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    linkAccount: async ({user}) => {
      await db.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      });
    }
  },
  callbacks: {
    signIn: async ({user, account, profile}) => {
      // Allow OAuth providers to sign in without email verification
      if (account?.type === "oauth") {
        return true;
      }

      const existingUser = await getUserById(user.id || "");
      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete two factor confirmation for next time login
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        });

        return true;
      }

      return true;
    },
    session: async ({session, token}) => {
      console.log({
        sessionToken: token
      });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }



      console.log({session});
      return session;
    },

    jwt: async ({token, user, account, profile, isNewUser}) => {
      console.log('I have been called again');

      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (existingUser) {
        const existingAccount = await getAccountByUserId(existingUser.id);

        token.isOAuth = !!existingAccount;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role as UserRole;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      }

      return token;
    }
  },
  ...authConfig
});
