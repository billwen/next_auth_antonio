import * as z from 'zod';
import {UserRole} from "@prisma/client";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6))
}).refine( (data) =>  {
  if (data.password && !data.newPassword) {
    return false;
  }

  return !(data.newPassword && !data.password);

}, {
  message: "New password is required!",
  path: ["newPassword"]
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum 6 characters required.',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Message is required. Please enter a valid email address',
  })
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Message is required. Please enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
  code: z.optional(z.string())
});

export const RegisterSchema = z.object({
  name: z.string().min(3, {
    message: 'Name is required. Please enter a valid name',
  }),
  email: z.string().email({
    message: 'Message is required. Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required.',
  }),
  // confirmPassword: z.string().min(6, {
  //   message: 'Password is required.',
  // }),
});
