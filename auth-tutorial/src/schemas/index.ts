import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Message is required. Please enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});
