"use server";

import {z} from "zod";
import {hash} from "bcrypt";

import {RegisterSchema} from "@/schemas";
import {db} from "@/lib/db";
import {getUserByEmail} from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validate the schema
  const validated = RegisterSchema.safeParse(values);
  if (!validated.success) {
    console.error("Validation failed: ", validated.error);
    return {error: "Invalid fields"};
  }

  const {name, email, password} = validated.data;
  const hashedPassword = await hash(password, 10);

  // duplicate email check
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {error: "Email already in use"};
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  // TODO: send verification email

  return {success: 'User created!'};
};
