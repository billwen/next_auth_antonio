"use server";

import {z} from "zod";
import {LoginSchema} from "@/schemas";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Validate the schema
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) {
    console.error("Validation failed: ", validated.error);
    return {error: "Invalid fields"};
  }

  const {email, password} = validated.data;

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
