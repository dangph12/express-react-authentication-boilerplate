import { z } from 'zod';

export const signUpRequestSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
  gender: z.enum(['male', 'female', 'other']),
  password: z.string().min(6)
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
}
