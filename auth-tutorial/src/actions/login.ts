"use server";

import {z} from "zod";
import {LoginSchema} from "@/schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Validate the schema
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) {
    console.error("Validation failed: ", validated.error);
    return {error: "Invalid fields"};
  }

  console.log("Logging in with values: ", values);
  return {success: 'Email sent!'};
};
