"use server";

import * as z from "zod";
import {SettingsSchema} from "@/schemas";
import {currentUser} from "@/lib/auth";
import {getUserByEmail, getUserById} from "@/data/user";
import {db} from "@/lib/db";
import {generateVerifiableToken} from "@/lib/tokens";
import {sendVerficationEmail} from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return {error: "Unauthorized"};
  }

  // Check user from database to insure user is not from a saved session
  const dbUser = await getUserById(user.id || '');
  if (!dbUser) {
    return { error: "Unauthorized"};
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    // Confirm the new email is not occupied by other users
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return {error: 'Email already in use!'};
    }

    const verificationToken = await generateVerifiableToken(values.email);
    await sendVerficationEmail(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent"};
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password);

    if (!passwordMatch) {
      return { errro: "Incorrect password!"}
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: {id: dbUser.id},
    data: {
      ...values
    }
  });

  return { success: 'Setting updated' };
};
