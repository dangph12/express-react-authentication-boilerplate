import { z } from 'zod';

export const forgotPasswordRequestSchema = z.object({
  email: z.email('Invalid email address')
});
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

export const resetPasswordRequestSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long')
});
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
