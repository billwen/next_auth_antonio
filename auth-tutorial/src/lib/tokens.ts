import {v4 as uuid} from 'uuid';

import {getVerificationTokenByEmail} from "@/data/verification-token";
import {db} from "@/lib/db";

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
