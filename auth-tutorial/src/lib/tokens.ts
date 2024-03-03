import {v4 as uuid} from 'uuid';
import crypto from "crypto";

import {getVerificationTokenByEmail} from "@/data/verification-token";
import {db} from "@/lib/db";
import {getPasswordResetTokenByToken} from "@/data/password-reset-token";
import {getTwoFactorTokenByEmail} from "@/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id
      }
    });
  }

  return await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  });
};

export const generateVerifiableToken = async (email: string) => {
  const token = uuid();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    // Remove existing token from db
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    });
  }

  const user = await db.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
      user: {
        connect: {
          id: user.id
        }
      }
    }
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByToken(email);

  if (existingToken) {
    await db.passwordResetToken.deleteMany({
      where: {
        email
      },
    });
  }

  return await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  });
};