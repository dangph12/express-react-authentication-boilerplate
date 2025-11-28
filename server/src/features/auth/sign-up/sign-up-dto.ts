import { z } from 'zod';

import { GENDER_VALUES } from '~/shared/constants/gender';

export const signUpRequestSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  avatar: z.file().optional(),
  gender: z.enum(GENDER_VALUES, { message: 'Invalid gender' }).optional(),
  dob: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
}
