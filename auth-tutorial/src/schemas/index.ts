import * as z from 'zod';

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
