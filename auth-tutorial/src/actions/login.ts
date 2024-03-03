"use server";

import {z} from "zod";
import {LoginSchema} from "@/schemas";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import {getUserByEmail} from "@/data/user";
import {generateTwoFactorToken, generateVerifiableToken} from "@/lib/tokens";
import {sendTwoFactorTokenEmail, sendVerficationEmail} from "@/lib/mail";
import {getTwoFactorTokenByEmail} from "@/data/two-factor-token";
import {db} from "@/lib/db";
import {getTwoFactorConfirmationByUserId} from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log({login: values});

  // Validate the schema
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) {
    console.error("Validation failed: ", validated.error);
    return {error: "Invalid fields"};
  }

  const {email, password, code} = validated.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return {error: "Invalid email or password"};
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerifiableToken(existingUser.email);
    await sendVerficationEmail(existingUser.email, verificationToken.token);
    return {success: "Confirmation email sent!"};
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // Verify the code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {error: "Invalid code!"};
      }

      if (twoFactorToken.token !== code) {
        return {error: "Invalid code!"};
      }

      if (new Date() > new Date(twoFactorToken.expires)) {
        return {error: "Code expired."};
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id
        }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {id: existingConfirmation.id}
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })
    } else {
      // Send a new verify code
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      if (!twoFactorToken) {
        return {error: "Generate two factor failed."}
      }
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    });
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return {error: "Invalid email or password"};

        default:
          return {error: "An error occurred"};
      }
    }
    throw e;
  }

  return {success: 'Email sent!'};
};
