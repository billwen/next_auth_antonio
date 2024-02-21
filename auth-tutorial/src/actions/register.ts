"use server";

import {z} from "zod";
import {RegisterSchema} from "@/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validate the schema
  const validated = RegisterSchema.safeParse(values);
  if (!validated.success) {
    console.error("Validation failed: ", validated.error);
    return {error: "Invalid fields"};
  }

  console.log("Logging in with values: ", values);
  return {success: 'Email sent!'};
};
